document.addEventListener("DOMContentLoaded", function () {
  
  /* ---------- Split post titles at ":" into main title + subheadline span ----------- */
  function splitHeadings(container) {
    const entryTitles = container.querySelectorAll(".entry-title");
    entryTitles.forEach(el => {
      // Avoid splitting if already done
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

  // Run once at start
  splitHeadings(document);

  // Watch the whole body for dynamically injected .entry-title content
  const splitObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          // Check this node and its descendants
          splitHeadings(node);
        }
      });
    });
  });

  splitObserver.observe(document.body, { childList: true, subtree: true });

  
  /* ------------------ Add tooltips to clamped titles ------------------ */
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

  const tooltipObserver = new MutationObserver(addTooltips);
  tooltipObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  
  // Lägger in GAS efter vart fjärde stycke direkt under #post-body

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


  // Visar relaterade inlägg för en given tagg
  // Användning: <div class="related-posts" data="Ett artistnamn"></div>

  const containers = document.querySelectorAll(".related-posts[data]");
  const currentUrl = window.location.href;
  const seenUrls = new Set();

  containers.forEach((container, containerIndex) => {
    const labels = container.getAttribute("data").split(",").map(l => l.trim());
    container.innerHTML = `<h2>See Also</h2>`;

    labels.forEach((label, labelIndex) => {
      const sectionId = `related-${containerIndex}-${labelIndex}`;
      const callbackName = `renderRelatedPosts_${sectionId}`;

      const section = document.createElement("div");
      section.id = sectionId;
      section.innerHTML = `<h3>[${label}]</h3><div class="blurb-container" id="${sectionId}-inner"></div>`;
      container.appendChild(section);

      // Definiera callback innan scriptet laddas
      window[callbackName] = function(data) {
        const entries = data.feed?.entry || [];
        const inner = document.getElementById(`${sectionId}-inner`);
        let count = 0;

        entries.forEach(entry => {
          const postUrl = entry.link.find(l => l.rel === "alternate")?.href;
          if (!postUrl || postUrl === currentUrl || seenUrls.has(postUrl)) return;

          seenUrls.add(postUrl);
          const title = entry.title?.$t || "Untitled";
          const content = entry.content?.$t || "";
          const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
          const imgSrc = imgMatch ? imgMatch[1] : "https://via.placeholder.com/500x300";

          const div = document.createElement("div");
          div.className = "blurb";
          div.innerHTML = `
            <a href="${postUrl}">
              <img src="${imgSrc}" alt="${title}" />
              <h3>${title}</h3>
            </a>
          `;
          inner.appendChild(div);
          count++;
        });

        if (count === 0) {
          section.remove();
        }
      };

      // Ladda script med korrekt callback
      const script = document.createElement("script");
      script.src = `/feeds/posts/default/-/${encodeURIComponent(label)}?alt=json-in-script&max-results=5&callback=${callbackName}`;
      document.body.appendChild(script);
    });
  });



}); //EventListener DOMContentLoaded





/* Mass-applicerar alttexter i exv bildgallerier 
Ex på anrop:
applyAltTexts({
  artist: 'Miss Li',
  venue: 'Liseberg',
  year: '2025'
});
*/

window.applyAltTexts = function({ artist, venue, year, credit = 'Jonas Gustafsson/CrowdSnapper', selector = 'image-gallery img' }) {
  const images = document.querySelectorAll(selector);
  images.forEach((img, index) => {
    img.alt = `${artist} live at ${venue} ${year} – Photo ${index + 1} by ${credit}`;
    img.title = `Photo ${index + 1} of ${artist} at ${venue} – Click/tap to view`;
  });
};

window.addEventListener('load', function () {
  const el = document.getElementById('alttext-data');

  if (!el) {
    console.warn('Ingen alttext-data hittades på sidan ❌');
    return;
  }

  if (typeof applyAltTexts === 'function') {
    const data = {
      artist: el.dataset.artist,
      venue: el.dataset.venue,
      year: el.dataset.year
    };
    console.log('Hittade data för alttexter:', data);
    applyAltTexts(data);
  } else {
    console.warn('applyAltTexts-funktionen finns inte 🙃');
  }

  const imgs = document.querySelectorAll('image-gallery img');
  console.log('Hittade', imgs.length, 'bilder i <image-gallery>');
});
