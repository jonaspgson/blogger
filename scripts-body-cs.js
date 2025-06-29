/* Hides sub-headings (anything appearing after ':' mark) on the homepage links */

document.addEventListener("DOMContentLoaded", function() {
    // Run only on the homepage
    if (location.pathname === "/" || location.pathname === "/index.html") {
      const titles = document.querySelectorAll(".entry-title a");
      titles.forEach(link => {
        const original = link.textContent;
        const cutoff = original.indexOf(":");
        if (cutoff !== -1) {
          link.textContent = original.substring(0, cutoff);
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


