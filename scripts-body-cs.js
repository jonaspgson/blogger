document.addEventListener("DOMContentLoaded", function () {
  /* Splits the post heading into main and sub-heading after the ':' sign. */
  // Only run on single post pages
  if (document.body.classList.contains("item")) {
    const headlineElement = document.querySelector(".entry-title");
    if (headlineElement && headlineElement.textContent.includes(":")) {
      const text = headlineElement.textContent.trim();
      const parts = text.split(":");

      if (parts.length === 2) {
        // Preserve inner <a> if it exists
        const link = headlineElement.querySelector("a");
        if (link) {
          link.innerHTML = `${parts[0].trim()}<span class="subheadline">: ${parts[1].trim()}</span>`;
        } else {
          headlineElement.innerHTML = `${parts[0].trim()}<span class="subheadline">: ${parts[1].trim()}</span>`;
        }
      }
    }
  }
});
