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
            // Avoid splitting twice by checking if subheadline already exists
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

  // Initial split on existing content
  splitHeadings(document);

  // Observe dynamic changes in .featured-posts and .videos-block
  const observerTargets = document.querySelectorAll(".featured-posts, .videos-block");
  observerTargets.forEach(target => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
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

  // Initial run for anything already on the page
  addTooltips();

  // Watch for dynamic content (e.g. widgets)
  const observer = new MutationObserver(addTooltips);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
