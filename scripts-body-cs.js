document.addEventListener("DOMContentLoaded", function () {
  initTooltips();
  initSplitHeadings();
  initEventInfo();
  initAds();
  initRelatedPosts();
  initAutoRelatedPosts();
  initAltTextHandler();
  initTagLabels();
});


/* ---------- 1. Add tooltips to clamped titles ---------- */
function initTooltips() {
  function addTooltips() {
    const selectors = [".item-title a", ".entry-title a"];
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(link => {
        const fullText = link.textContent.trim();
        if (fullText && !link.hasAttribute("title")) {
          link.setAttribute("title", fullText);
        }
      });
    });
  }

  addTooltips();

  const observer = new MutationObserver(addTooltips);
  observer.observe(document.body, { childList: true, subtree: true });
}


/* ---------- 2. Split post titles at ":" ---------- */
function initSplitHeadings() {
  function splitHeadings(container) {
    const entryTitles = container.querySelectorAll(".entry-title");
    entryTitles.forEach(el => {
      if (el.textContent.includes(":") && !el.innerHTML.includes("subheadline")) {
        const link = el.querySelector("a");
        const target = link || el;
        const text = target.textContent.trim();
        const parts = text.split(":");
        if (parts.length === 2) {
          const main = parts[0].trim();
          const sub = parts[1].trim();
          target.innerHTML = `${main} <span class="subheadline">${sub}</span>`;
        }
      }
    });
  }

  splitHeadings(document);

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          splitHeadings(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}


/* ---------- 3. Inserts an event info box below the byline, including date of last post update ------------ */

function initEventInfo() {
  // Format ISO → "7 Nov, 2025"
  function formatDate(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    const parts = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).split(" ");
    return `${parts[0]} ${parts[1]}, ${parts[2]}`;
  }

  // Format ISO → "20:00"
  function formatTime(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  // --- 1. Event date & time from Blogger ---
  const publishedEl = document.querySelector("time.published");
  const eventISO = publishedEl?.getAttribute("datetime") || null;
  const eventDate = formatDate(eventISO);
  const eventTime = formatTime(eventISO);

  // --- 2. Event metadata (supports both old and new IDs) ---
  const meta =
    document.getElementById("event-data") ||
    document.getElementById("alttext-data");

  // Venue handling (supports both old and new formats)
  let venueFull = null;

  if (meta) {
    if (meta.dataset.venue && meta.dataset.city) {
      // New model: separate fields
      venueFull = `${meta.dataset.venue}, ${meta.dataset.city}`;
    } else if (meta.dataset.venue) {
      // Old model: full string already combined
      venueFull = meta.dataset.venue;
    }
  }

  // Optional duration
  const duration = meta?.dataset.duration || null;

  // --- 3. Updated date from JSON-LD ---
  function getModifiedFromJsonLd() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent);
        if (data["@type"] === "NewsArticle" && data.dateModified) {
          return data.dateModified;
        }
      } catch (e) {}
    }
    return null;
  }

  const updatedISO = getModifiedFromJsonLd();
  const updatedDate = formatDate(updatedISO);

  // --- 4. Build the <event-info> box ---
  const bylines = document.querySelectorAll(".byline");
  if (bylines.length === 0) return;

  const lastByline = bylines[bylines.length - 1];
  const box = document.createElement("event-info");

  let html = "";

  // Event line (only if we have at least date + venue)
  if (eventDate && venueFull) {
    html += `<div class="event-line">Event: ${eventDate}`;

    if (eventTime) html += ` 🕒 ${eventTime}`;
    html += ` at ${venueFull}</div>`;
  }

  // Duration line (optional)
  if (duration) {
    html += `<div class="duration-line">Duration: ${duration}</div>`;
  }

  // Updated line (optional)
  if (updatedDate) {
    html += `<div class="updated-line">Updated: ${updatedDate}</div>`;
  }

  box.innerHTML = html;
  lastByline.insertAdjacentElement("afterend", box);
}

/*
function initEventInfo() {
  // Format ISO → "7 Nov, 2025"
  function formatDate(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    const parts = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).split(" ");
    return `${parts[0]} ${parts[1]}, ${parts[2]}`;
  }

  // Format ISO → "20:00"
  function formatTime(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  // --- 1. Event date & time from Blogger ---
  const publishedEl = document.querySelector("time.published");
  const eventISO = publishedEl?.getAttribute("datetime") || null;
  const eventDate = formatDate(eventISO);
  const eventTime = formatTime(eventISO);

  // --- 2. Venue (full string) from alttext-data ---
  const alt = document.getElementById("alttext-data");
  const venueFull = alt?.dataset.venue || null;

  // --- 3. Updated date from JSON-LD ---
  function getModifiedFromJsonLd() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent);
        if (data["@type"] === "NewsArticle" && data.dateModified) {
          return data.dateModified;
        }
      } catch (e) {}
    }
    return null;
  }

  const updatedISO = getModifiedFromJsonLd();
  const updatedDate = formatDate(updatedISO);

  // --- 4. Build the <event-info> box ---
  const bylines = document.querySelectorAll(".byline");
  if (bylines.length === 0) return;

  const lastByline = bylines[bylines.length - 1];
  const box = document.createElement("event-info");

  let html = "";

  // Event line
  if (eventDate && eventTime && venueFull) {
    html += `<div class="event-line">Event: ${eventDate} 🕒 ${eventTime} at ${venueFull}</div>`;
  }

  // Updated line
  if (updatedDate) {
    html += `<div class="updated-line">Updated: ${updatedDate}</div>`;
  }

  box.innerHTML = html;
  lastByline.insertAdjacentElement("afterend", box);
}
*/


/* ---------- 4. Insert Google Ads in post content ---------- */

function initAds() {
  const postBody = document.querySelector("#post-body");
  if (!postBody) return;

  const paragraphs = Array.from(postBody.children).filter(el => el.tagName === "P");

  // Lägg till annons efter vart fjärde stycke
  paragraphs.forEach((p, index) => {
    if ((index + 1) % 4 === 0) {
      const ad = document.createElement("ins");
      ad.className = "adsbygoogle";
      ad.style.display = "block";
      ad.style.textAlign = "center";
      ad.setAttribute("data-ad-layout", "in-article");
      ad.setAttribute("data-ad-format", "fluid");
      ad.setAttribute("data-ad-client", "ca-pub-8323647897395400");
      ad.setAttribute("data-ad-slot", "7820669675");

      p.parentNode.insertBefore(ad, p.nextSibling);
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  });
}



/* ---------- 5A. Show related posts for given tags (manual version) ---------- 
 * Use: <div class="related-content" 
 *           data-tags="tag 1, tag 2, etc" 
 *           data-caption="Optional heading"
 *           data-showdate="yes/no"
 *           data-maxresults="(number)"></div>
 */
function initRelatedPosts() {
  const containers = document.querySelectorAll(".related-content");
  const currentUrl = window.location.href;
  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/500x300";
  const DEFAULT_MAX_POSTS = 6;
  const DEFAULT_SHOW_DATE = true;
  const DEFAULT_CAPTION = "Also on CrowdSnapper";

  // Global kö
  window.relatedPostQueue = [];

  // Global callback
  window.handleRelatedPosts = function(json) {
    const task = window.relatedPostQueue.shift();
    if (!task) return;

    const { container, sectionId, showDate, maxResults, seenUrls, relatedPosts, labels, tagIndex } = task;

    const entries = json.feed?.entry || [];

    entries.forEach(entry => {
      if (relatedPosts.length >= maxResults) return;

      const postUrl = entry.link.find(l => l.rel === "alternate")?.href;
      if (!postUrl || postUrl === currentUrl || seenUrls.has(postUrl)) return;

      seenUrls.add(postUrl);

      relatedPosts.push({
        title: entry.title?.$t || "Untitled",
        link: postUrl,
        content: entry.content?.$t || "",
        published: entry.published?.$t || ""
      });
    });

    // Fortsätt till nästa tagg om vi inte har tillräckligt
    if (relatedPosts.length < maxResults && tagIndex + 1 < labels.length) {
      queueTag(task, tagIndex + 1);
    } else {
      renderRelatedPosts(sectionId, container, relatedPosts, showDate);
    }
  };

  function queueTag(task, newIndex) {
    const label = task.labels[newIndex];
    const feedUrl = `/feeds/posts/default/-/${encodeURIComponent(label)}?alt=json-in-script&max-results=10&callback=handleRelatedPosts`;

    window.relatedPostQueue.push({
      ...task,
      tagIndex: newIndex
    });

    const script = document.createElement("script");
    script.src = feedUrl;
    document.body.appendChild(script);
  }

  function renderRelatedPosts(sectionId, container, relatedPosts, showDate) {
    const inner = document.getElementById(`${sectionId}-inner`);
    if (!inner || relatedPosts.length === 0) {
      container.remove();
      return;
    }

    relatedPosts.forEach(post => {
      const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
      const imgSrc = imgMatch ? imgMatch[1] : PLACEHOLDER_IMAGE;

      const dateStr = showDate && post.published
        ? `<p class="post-date">${new Date(post.published).toLocaleDateString()}</p>`
        : "";

      const div = document.createElement("div");
      div.className = "blurb";
      div.innerHTML = `
        <a href="${post.link}">
          <img src="${imgSrc}" alt="${post.title}" />
          <div class="blurb-text">
            <h3 class="entry-title">${post.title}</h3>
            ${dateStr}
          </div>
        </a>
      `;
      inner.appendChild(div);
    });
  }

  // Initiera varje container
  containers.forEach((container, containerIndex) => {
    const rawTags = container.getAttribute("data-tags");
    if (!rawTags) return;

    const labels = rawTags.split(",").map(l => l.trim()).filter(Boolean);
    if (labels.length === 0) return;

    const rawCaption = container.getAttribute("data-caption");
    const caption = rawCaption === null ? DEFAULT_CAPTION : rawCaption;
    const showCaption = caption.trim() !== "";

    const rawShowDate = container.getAttribute("data-showdate");
    const showDate = rawShowDate === null
      ? DEFAULT_SHOW_DATE
      : rawShowDate.toLowerCase() === "yes";

    const maxPostsAttr = container.getAttribute("data-maxposts");
    const maxPosts = parseInt(maxPostsAttr, 10);
    const maxResults = isNaN(maxPosts) ? DEFAULT_MAX_POSTS : maxPosts;

    if (showCaption) {
      container.innerHTML = `<h2 class="caption">${caption}</h2>`;
    }

    const sectionId = `related-${containerIndex}`;
    const section = document.createElement("div");
    section.id = sectionId;
    section.innerHTML = `<div class="blurb-container" id="${sectionId}-inner"></div>`;
    container.appendChild(section);

    // Starta med första taggen
    queueTag({
      container,
      sectionId,
      showDate,
      maxResults,
      seenUrls: new Set(),
      relatedPosts: [],
      labels,
      tagIndex: 0
    }, 0);
  });
}


/* ---------- 5B. Show related posts for given tags (automatic version) ---------- */
function initAutoRelatedPosts() {
  const MAX_RELATED_POSTS = 6;
  const MAX_TAGS = 3;
  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/500x300";

  if (document.querySelector(".related-content")) return;

  const tagElements = document.querySelectorAll('.entry-tags a.label-link');
  const tags = Array.from(tagElements).map(el => el.textContent.trim()).slice(0, MAX_TAGS);

  const currentUrl = window.location.href;
  const seenUrls = new Set();
  const relatedCandidates = [];

  const container = document.getElementById("related-content-placeholder");
  if (!container) return;

  function fetchTag(index) {
    if (index >= tags.length || relatedCandidates.length >= MAX_RELATED_POSTS) {
      renderRelatedPosts();
      return;
    }

    const tag = tags[index];
    const feedUrl = `/feeds/posts/default/-/${encodeURIComponent(tag)}?alt=json-in-script&max-results=10`;
    const callbackName = `handleAutoRelatedPosts_${index}`;

    window[callbackName] = function(json) {
      const entries = json.feed?.entry || [];

      entries.forEach(entry => {
        if (relatedCandidates.length >= MAX_RELATED_POSTS) return;

        const link = entry.link.find(l => l.rel === 'alternate')?.href;
        if (!link || link === currentUrl || seenUrls.has(link)) return;

        seenUrls.add(link);

        relatedCandidates.push({
          title: entry.title?.$t || "Untitled",
          link,
          content: entry.content?.$t || "",
          published: entry.published?.$t || ""
        });
      });

      fetchTag(index + 1); // Gå vidare till nästa tagg
    };

    const script = document.createElement("script");
    script.src = `${feedUrl}&callback=${callbackName}`;
    document.body.appendChild(script);
  }

  function renderRelatedPosts() {
    if (relatedCandidates.length === 0) return;

    const inner = document.createElement("div");
    inner.className = "blurb-container";

    relatedCandidates.forEach((post, i) => {
      const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
      const imgSrc = imgMatch ? imgMatch[1] : PLACEHOLDER_IMAGE;

      const dateStr = post.published
        ? `<p class="post-date">${new Date(post.published).toLocaleDateString()}</p>`
        : "";

      const div = document.createElement("div");
      div.className = "blurb";
      div.innerHTML = `
        <a href="${post.link}">
          <img src="${imgSrc}" alt="${post.title}" />
          <div class="blurb-text">
            <h3 class="entry-title">${post.title}</h3>
            ${dateStr}
          </div>
        </a>
      `;

      inner.appendChild(div);
    });

    container.innerHTML = `<h2 class="caption">Also on CrowdSnapper</h2>`;
    container.appendChild(inner);
  }

  fetchTag(0); // 🚀 Starta med första taggen
}


/* ---------- 6. Apply alt texts to image galleries ---------- */

function initAltTextHandler() {
  window.applyAltTexts = function ({
    artist,
    venue,
    year,
    credit = "Jonas Gustafsson/CrowdSnapper",
    selector = "image-gallery img"
  }) {
    const images = document.querySelectorAll(selector);
    images.forEach((img, index) => {
      img.alt = `${artist} live at ${venue} ${year} – Photo ${index + 1} by ${credit}`;
      img.title = `Photo ${index + 1} of ${artist} at ${venue}, ${year} – Click to view`;
    });
  };

  window.addEventListener("load", function () {
    const el = document.getElementById("alttext-data");
    if (!el) {
      console.warn("Ingen alttext-data hittades på sidan ❌");
      return;
    }

    const data = {
      artist: el.dataset.artist,
      venue: el.dataset.venue,
      year: el.dataset.year
    };

    console.log("Hittade data för alttexter:", data);

    if (typeof applyAltTexts === "function") {
      applyAltTexts(data);
    } else {
      console.warn("applyAltTexts-funktionen finns inte 🙃");
    }

    const imgs = document.querySelectorAll("image-gallery img");
    console.log("Hittade", imgs.length, "bilder i <image-gallery>");
  });
}


/* -------------------- 7. Adjust custom post tags -------------------------- */

function initTagLabels() {
  document.querySelectorAll('.entry-tags a.label-link').forEach(link => {
    const text = link.textContent.trim();

    if (text.startsWith("z_")) {
      link.title = text;
      link.textContent = "🎵 " + text.replace(/^z_/, "");
    } else if (text.startsWith("Ω")) {
      link.title = text;
      link.textContent = "📁 " + text.replace(/^Ω /, "");
    } else if (text.endsWith("(event)")) { // ← Här var felet
      link.title = text;
      link.textContent = "🎉 " + text.replace(/\s*\(event\)$/, "");
    }
  });
}
