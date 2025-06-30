document.addEventListener("DOMContentLoaded", function () {
  /* Splits the post heading into main and sub-heading after the ':' sign. */
  // Only run on post pages
  if (document.body.classList.contains("item")) {
    const headlineElement = document.querySelector(".entry-title");
    if (headlineElement && headlineElement.textContent.includes(":")) {
      const text = headlineElement.textContent.trim();
      const parts = text.split(":");

      if (parts.length === 2) {
        const main = parts[0].trim();
        const sub = parts[1].trim();

        const link = headlineElement.querySelector("a");
        if (link) {
          link.innerHTML = `${main}<span class="subheadline">${sub}</span>`;
        } else {
          headlineElement.innerHTML = `${main}<span class="subheadline">${sub}</span>`;
        }
      }
    }
  }

  
  /* Adds tooltips to homepage links (useful for clamped titles) */
   setTimeout(() => {
      const selectors = [
        ".item-title a",
        ".entry-title a"
      ];

      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(link => {
          const fullText = link.textContent.trim();
          if (!link.hasAttribute("title")) {
            link.setAttribute("title", fullText);
          }
        });
      });
    }, 1000); // Wait 1s for widgets to load
  });
});
