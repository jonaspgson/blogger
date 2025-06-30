document.addEventListener("DOMContentLoaded", function () {

  /* -------- Splits the post heading into main and sub-heading after the ':' sign. ---------------- */

  function splitHeadings(container) {
    const entryTitles = container.querySelectorAll(".entry-title");
    entryTitles.forEach(headlineElement => {
      if (headlineElement.textContent.includes(":")) {
        const text = headlineElement.textContent.trim();
        const parts = text.split(":");
        if (parts.length === 2) {
          const main = parts[0].trim();
          const sub = parts[1].trim();
          const link = headlineElement.querySelector("a");
          if (link) {
            if (!link.querySelector(".subheadline")) {
              link.innerHTML = `${main}<span class="subheadline">${sub}</span>`;
            }
          } else {
            if (!headlineElement.querySelector(".subheadline")) {
              headlineElement.innerHTML = `${main}<span class="subheadline">${sub}</span>`;
            }
          }
        }
      }
    });
  }

  // Initial run on page content
  splitHeadings(document);


  // Observe .featured-posts and .videos-block for dynamic updates
  const observerTargets = document.querySelectorAll(".featured-posts, .videos-block");
  observerTargets.forEach(target => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            splitHeadings(node);
          }
        });
      });
    });
    observer.observe(target, { childList: true, subtree: true });
  });


  /* ------------- Adds tooltips to homepage links (useful for clamped titles) ------------------- */

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

  // Initial run
  addTooltips();

  // Observe entire body for tooltip updates (e.g. dynamic widgets)
  const tooltipObserver = new MutationObserver(addTooltips);
  tooltipObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

});
