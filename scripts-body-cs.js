document.addEventListener("DOMContentLoaded", function () {
  initSplitHeadings();
  initTooltips();
  initAds();
  initRelatedPosts();
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

/* ---------- 4. Show related posts for given tags ---------- */
function initRelatedPosts() {
  const containers = document.querySelectorAll(".related-posts[data-tag]");
  const currentUrl = window.location.href;
  const relatedQueue = [];

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
      const imgSrc = imgMatch ? imgMatch[1] : "https://via.placeholder.com/500x300";

      const dateStr = showDate && published
        ? `<p class="post-date">${new Date(published).toLocaleDateString()}</p>`
        : "";

      const div = document.createElement("div");
      div.className = "blurb";
      div.innerHTML = `
        <a href="${postUrl}">
          <img src="${imgSrc}" alt="${title}" />
          <h3 class="entry-title">${title}</h3>
          ${dateStr}
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
    const labels = container.getAttribute("data-tag").split(",").map(l => l.trim());
    let caption = container.getAttribute("data-caption");
    const showCaption = caption && caption.toLowerCase() !== "none" && caption.toLowerCase() !== "false";
    caption = caption || "Related Posts";
  
    const showDate = container.getAttribute("data-showdate")?.toLowerCase() === "yes";
    const seenUrls = new Set();
  
    if (showCaption) {
      container.innerHTML = `<h2>${caption}</h2>`;
    }
  
    labels.forEach((label, labelIndex) => {
      const sectionId = `related-${containerIndex}-${labelIndex}`;
      const section = document.createElement("div");
      section.id = sectionId;
      section.innerHTML = `<div class="blurb-container" id="${sectionId}-inner"></div>`;
      container.appendChild(section);
  
      relatedQueue.push({ label, sectionId, currentUrl, seenUrls, showDate });
  
      const script = document.createElement("script");
      script.src = `/feeds/posts/default/-/${encodeURIComponent(label)}?alt=json-in-script&max-results=5&callback=renderRelatedPosts`;
      document.body.appendChild(script);
    });
  });
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
