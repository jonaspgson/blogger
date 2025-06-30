/* Hides sub-headings (anything appearing after ':' mark) on the homepage links */

document.addEventListener("DOMContentLoaded", function () {
  function trimText(selector, maxLength) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      const link = el.querySelector("a");
      if (link) {
        const original = link.textContent.trim();
        if (original.length > maxLength) {
          // Trim at nearest space before maxLength to avoid cutting words
          let cutoff = original.lastIndexOf(" ", maxLength);
          if (cutoff === -1) cutoff = maxLength;
          const trimmed = original.substring(0, cutoff).trim() + "…";
          
          link.textContent = trimmed;
          link.setAttribute("title", original); // Tooltip with full title
        }
      }
    });
  }

  // Featured section (top of homepage)
  trimText(".featured-posts .entry-title, .featured-posts h2, .featured-posts h3", 40);

  // Sidebar Popular Posts widget
  trimText(".PopularPosts .item-title, .PopularPosts .entry-title", 40);
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


