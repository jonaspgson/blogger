document.addEventListener("DOMContentLoaded", function () {
  
  /* Trims post titles on the homepage */
  /*function trimText(selector, maxLength) {
    const links = document.querySelectorAll(selector);
    links.forEach(link => {
      const original = link.textContent.trim();
      if (original.length > maxLength) {
        // Trim at nearest space before maxLength to avoid cutting words
        let cutoff = original.lastIndexOf(" ", maxLength);
        if (cutoff === -1) cutoff = maxLength;
        const trimmed = original.substring(0, cutoff).trim() + "…";

        link.textContent = trimmed;
        link.setAttribute("title", original); // Tooltip with full title
      }
    });
  }
  // Trim visible link titles in hero and video blocks
  trimText(".featured-posts .entry-title a, .videos-block .entry-title a", 40);
  // Sidebar Popular Posts widget
  trimText(".PopularPosts .item-title a, .PopularPosts .entry-title a", 40);*/

  /* Splits the post heading into main and sub-heading after the ':' sign. */

  const headlineElement = document.querySelector(".entry-title");
  if (headlineElement) {
    const link = headlineElement.querySelector("a");
    if (link) {
      const text = link.textContent.trim();
      const parts = text.split(":");

      if (parts.length === 2) {
        // Update the innerHTML of the link only, preserving it
        link.innerHTML = `${parts[0].trim()}<span class="subheadline">${parts[1].trim()}</span>`;
      }
    }
  }

});


    


