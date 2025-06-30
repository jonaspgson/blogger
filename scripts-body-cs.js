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
          target.innerHTML = `${main}<span class="subheadline">${sub}</span>`;
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
