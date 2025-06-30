/* Hides sub-headings (anything appearing after ':' mark) on the homepage links */

  document.addEventListener("DOMContentLoaded", function () {
    // Only run on homepage (you can expand this later for label pages)
    if (location.pathname === "/" || location.pathname === "/index.html") {
      const links = document.querySelectorAll("h2.entry-title a.entry-title-link");

      links.forEach(link => {
        const originalText = link.textContent.trim();
        const colonIndex = originalText.indexOf(":");

        if (colonIndex !== -1) {
          const trimmedText = originalText.substring(0, colonIndex).trim();
          link.textContent = trimmedText;
        }
      });
    }
  });


/* Split post heading into main and sub-heading */

const headlineElement = document.querySelector(".entry-title");
if (headlineElement) {
  const text = headlineElement.textContent;
  const parts = text.split(":");

  if (parts.length === 2) {
    headlineElement.innerHTML = `${parts[0].trim()}<span class="subheadline">${parts[1].trim()}</span>`;
  }
}


