document.addEventListener("DOMContentLoaded", () => {
  initAccordions();
  initImageCarousels();
  initGalleryToggle();
});


/* Accordion - requires additional CSS. */
function initAccordions() {
  let acc = document.getElementsByClassName("accordion");
  
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } 
    });
  }
}


/* Image carousel - requires additional CSS. */
function initImageCarousels() {
  const carousels = [
    ...document.querySelectorAll(".carousel"),
    ...document.querySelectorAll("image-carousel")
  ];

  carousels.forEach((carousel) => {
    const isXmlStyle = carousel.tagName.toLowerCase() === "image-carousel";
    const slides = isXmlStyle
      ? carousel.querySelectorAll("carousel-slide")
      : carousel.querySelectorAll(".slide");

    let currentIndex = 0;

    const leftBtn = document.createElement("button");
    leftBtn.className = "button button-left";
    carousel.appendChild(leftBtn);

    const rightBtn = document.createElement("button");
    rightBtn.className = "button button-right";
    carousel.appendChild(rightBtn);

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? "block" : "none";
      });
    }

    leftBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    });

    rightBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });

    showSlide(currentIndex);
  });
}

/* Adds a "Show More" button to image galleries larger than a specific height that can be clicked to expand them. */
function initGalleryToggle() {
  const galleries = document.querySelectorAll("image-gallery");
  const maxHeight = 560; // matchas mot max-height på .gallery-wrapper

  galleries.forEach(function (gallery) {
    // Skapa wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add("gallery-wrapper");

    // Flytta galleriet in i wrappern
    gallery.parentNode.insertBefore(wrapper, gallery);
    wrapper.appendChild(gallery);

    // Vänta tills layouten är klar
    requestAnimationFrame(() => {
      const actualHeight = gallery.scrollHeight;

      if (actualHeight > maxHeight) {
        // Skapa toggle-knapp
        const toggle = document.createElement("button");
        toggle.className = "toggle-gallery";
        toggle.type = "button";
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = '<span class="arrow">▼</span> <span class="label">Show More</span>';

        // Lägg till efter wrappern
        wrapper.parentNode.insertBefore(toggle, wrapper.nextSibling);

        // Toggle-funktion
        toggle.addEventListener("click", function () {
          const expanded = wrapper.classList.toggle("expanded");
          toggle.setAttribute("aria-expanded", expanded);
          toggle.querySelector(".label").textContent = expanded ? "Minimise" : "Show More";
        });
      } else {
        // Om galleriet är kort – ta bort max-height och fade
        wrapper.style.maxHeight = "none";
        wrapper.classList.add("expanded");
      }
    });
  });
}
