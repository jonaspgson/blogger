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

});


// Lägger in GAS efter vart fjärde direkta barn under #post-body

document.addEventListener("DOMContentLoaded", function () {
  const postBody = document.querySelector("#post-body");
  if (!postBody) return;

  const children = Array.from(postBody.children);
  let validCount = 0;

  for (let i = 0; i < children.length; i++) {
    const current = children[i];
    const prev = children[i - 1];
    const isPrevHeading = prev && /^H[1-6]$/.test(prev.tagName);

    // Skippa om föregående är en rubrik
    if (isPrevHeading) continue;

    validCount++;

    if (validCount % 4 === 0) {
      const ad = document.createElement("ins");
      ad.className = "adsbygoogle";
      ad.style.display = "block";
      ad.style.textAlign = "center";
      ad.setAttribute("data-ad-layout", "in-article");
      ad.setAttribute("data-ad-format", "fluid");
      ad.setAttribute("data-ad-client", "ca-pub-8323647897395400");
      ad.setAttribute("data-ad-slot", "7820669675");

      current.parentNode.insertBefore(ad, current.nextSibling);
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  }
});


