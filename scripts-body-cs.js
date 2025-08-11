document.addEventListener("DOMContentLoaded", function () {
  initSplitHeadings();
  initTooltips();
  initAds();
  initRelatedPosts();
  initAutoRelatedPosts();
  initAltTextHandler();
});

/* ---------- 1. Split post titles at ":" ---------- */
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

/* ---------- 2. Add tooltips to clamped titles ---------- */
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

/* ---------- 3. Insert Google Ads after every 4th paragraph ---------- */
function initAds() {
  const postBody = document.querySelector("#post-body");
  if (!postBody) return;

  const paragraphs = Array.from(postBody.children).filter(el => el.tagName === "P");

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

/* ---------- 4A. Show related posts for given tags (manual version) ---------- 
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

  const relatedQueue = [];

  window.renderRelatedPosts = function (data) {
    const task = relatedQueue.find(t => !t.done && t.label === data.feed.category?.[0]?.term);
    if (!task) return;

    const entries = data.feed?.entry || [];
    task.done = true;

    entries.forEach(entry => {
      const postUrl = entry.link.find(l => l.rel === "alternate")?.href;
      if (!postUrl || postUrl === task.currentUrl || task.seenUrls.has(postUrl)) return;

      task.seenUrls.add(postUrl);
      const title = entry.title?.$t || "Untitled";
      const content = entry.content?.$t || "";
      const published = entry.published?.$t || "";
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const imgSrc = imgMatch ? imgMatch[1] : PLACEHOLDER_IMAGE;

      task.results.push({
        url: postUrl,
        title,
        published,
        imgSrc,
        tagIndex: task.labels.indexOf(task.label)
      });
    });

    // När alla tasks för en section är klara
    const allDone = relatedQueue.filter(t => t.sectionId === task.sectionId).every(t => t.done);
    if (!allDone) return;

    const sectionTasks = relatedQueue.filter(t => t.sectionId === task.sectionId);
    const allPosts = sectionTasks.flatMap(t => t.results);

    // Sortera efter taggordning
    allPosts.sort((a, b) => a.tagIndex - b.tagIndex);

    // Rendera upp till maxPosts
    const inner = document.getElementById(`${task.sectionId}-inner`);
    let count = 0;
    for (const post of allPosts) {
      if (count >= task.maxPosts) break;

      const dateStr = task.showDate && post.published
        ? `<p class="post-date">${new Date(post.published).toLocaleDateString()}</p>`
        : "";

      const div = document.createElement("div");
      div.className = "blurb";
      div.innerHTML = `
        <a href="${post.url}">
          <img src="${post.imgSrc}" alt="${post.title}" />
          <div class="blurb-text">
            <h3 class="entry-title">${post.title}</h3>
            ${tagLabel}
            ${dateStr}
          </div>
        </a>
      `;
      inner.appendChild(div);
      count++;
    }

    if (count === 0) {
      document.getElementById(task.sectionId)?.remove();
    }
  };

  containers.forEach((container, containerIndex) => {
    const rawTags = container.getAttribute("data-tags");
    if (!rawTags) return;

    const labels = rawTags.split(",").map(l => l.trim());

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

    labels.forEach(label => {
      relatedQueue.push({
        label,
        labels,
        sectionId,
        currentUrl,
        seenUrls: new Set(),
        showDate,
        maxPosts: maxResults,
        results: [],
        done: false
      });

      const script = document.createElement("script");
      script.src = `/feeds/posts/default/-/${encodeURIComponent(label)}?alt=json-in-script&max-results=${maxResults}&callback=renderRelatedPosts`;
      document.body.appendChild(script);
    });
  });
}

/*
function initRelatedPosts() {
  const containers = document.querySelectorAll(".related-content");
  const currentUrl = window.location.href;
  const relatedQueue = [];

  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/500x300";
  const DEFAULT_MAX_POSTS = 6;
  const DEFAULT_SHOW_DATE = true;
  const DEFAULT_CAPTION = "Also on CrowdSnapper";

  window.renderRelatedPosts = function (data) {
    const task = relatedQueue.shift();
    if (!task) return;

    const { label, sectionId, seenUrls, showDate } = task;
    const entries = data.feed?.entry || [];
    const inner = document.getElementById(`${sectionId}-inner`);
    let count = 0;

    entries.forEach(entry => {
      const postUrl = entry.link.find(l => l.rel === "alternate")?.href;
      if (!postUrl || postUrl === currentUrl || seenUrls.has(postUrl)) return;

      seenUrls.add(postUrl);
      const title = entry.title?.$t || "Untitled";
      const content = entry.content?.$t || "";
      const published = entry.published?.$t || "";
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const imgSrc = imgMatch ? imgMatch[1] : PLACEHOLDER_IMAGE;

      const dateStr = showDate && published
        ? `<p class="post-date">${new Date(published).toLocaleDateString()}</p>`
        : "";

      const div = document.createElement("div");
      div.className = "blurb";
      div.innerHTML = `
        <a href="${postUrl}">
          <img src="${imgSrc}" alt="${title}" />
          <div class="blurb-text">
            <h3 class="entry-title">${title}</h3>
            ${dateStr}
          </div>
        </a>
      `;
      inner.appendChild(div);
      count++;
    });

    if (count === 0) {
      document.getElementById(sectionId)?.remove();
    }
  };

  containers.forEach((container, containerIndex) => {
    const rawTags = container.getAttribute("data-tags");
    if (!rawTags) return; // 🚫 Hoppa över om inga taggar finns

    const labels = rawTags.split(",").map(l => l.trim());

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

    labels.forEach(label => {
      relatedQueue.push({ label, sectionId, currentUrl, seenUrls: new Set(), showDate });

      const script = document.createElement("script");
      script.src = `/feeds/posts/default/-/${encodeURIComponent(label)}?alt=json-in-script&max-results=${maxResults}&callback=renderRelatedPosts`;
      document.body.appendChild(script);
    });
  });
}*/


/* ---------- 4B. Show related posts for given tags (automatic version) ---------- */
function initAutoRelatedPosts() {
  const MAX_RELATED_POSTS = 6;
  const MAX_TAGS = 3;
  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/500x300";

  if (document.querySelector(".related-content")) return;

  const tagElements = document.querySelectorAll('.entry-tags a.label-link');
  const tags = Array.from(tagElements).map(el => el.textContent.trim()).slice(0, MAX_TAGS);

  const currentUrl = window.location.href;
  const relatedCandidates = [];
  const seenUrls = new Set();
  let pendingFeeds = tags.length;

  tags.forEach((tag, index) => {
    const callbackName = `handleAutoRelatedPosts_${index}`;
    const feedUrl = `/feeds/posts/default/-/${encodeURIComponent(tag)}?alt=json-in-script&max-results=15`;
    const script = document.createElement('script');
    script.src = `${feedUrl}&callback=${callbackName}`;
    document.body.appendChild(script);

    window[callbackName] = function(json) {
      if (json.feed?.entry) {
        json.feed.entry.forEach(entry => {
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
      }

      pendingFeeds--;
      if (pendingFeeds === 0) renderRelatedPosts();
    };
  });

  function renderRelatedPosts() {
    const container = document.getElementById("related-content-placeholder");
    if (!container) return;

    if (relatedCandidates.length === 0) {
      container.innerHTML = `<p class="caption">Inga relaterade inlägg hittades.</p>`;
      return;
    }

    relatedCandidates.sort((a, b) => new Date(b.published) - new Date(a.published));

    const inner = document.createElement("div");
    inner.className = "blurb-container";

    relatedCandidates.slice(0, MAX_RELATED_POSTS).forEach(post => {
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
}


/* ---------- 5. Apply alt texts to image galleries ---------- */
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
      img.title = `Photo ${index + 1} of ${artist} at ${venue} – Click/tap to view`;
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
