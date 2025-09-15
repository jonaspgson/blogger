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
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {
    const slides = carousel.querySelectorAll(".slide");
    let currentIndex = 0;

    // Skapa navigeringsknappar
    const leftBtn = document.createElement("button");
    leftBtn.className = "button button-left";
    carousel.appendChild(leftBtn);

    const rightBtn = document.createElement("button");
    rightBtn.className = "button button-right";
    carousel.appendChild(rightBtn);

    // Visa vald slide
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove("active");
        slide.style.transform = "translateX(0)";
      });
      slides[index].classList.add("active");
    }

    // Klick på knappar
    leftBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    });

    rightBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });

    // 🟦 Touch-swipe (mobil)
    let touchStartX = 0;
    carousel.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    });

    carousel.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;

      if (Math.abs(diffX) > 50) {
        currentIndex = diffX < 0
          ? (currentIndex + 1) % slides.length
          : (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
      }
    });

    // 🖱️ Mouse-drag (desktop med visuell feedback)
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let animationID;
    let activeSlide, nextSlide;
    
    function setSlidePositions(offsetX) {
      if (activeSlide) activeSlide.style.transform = `translateX(${offsetX}px)`;
      if (nextSlide) nextSlide.style.transform = `translateX(${offsetX + (offsetX < 0 ? carousel.offsetWidth : -carousel.offsetWidth)}px)`;
    }
    
    function animation() {
      const offsetX = currentX - startX;
      setSlidePositions(offsetX);
      if (isDragging) requestAnimationFrame(animation);
    }
    
    carousel.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      currentX = startX;
      activeSlide = slides[currentIndex];
      activeSlide.style.transition = "none";
    
      // Förbered nästa/föregående slide
      const nextIndex = e.clientX < carousel.offsetWidth / 2
        ? (currentIndex + 1) % slides.length
        : (currentIndex - 1 + slides.length) % slides.length;
    
      nextSlide = slides[nextIndex];
      nextSlide.style.display = "block";
      nextSlide.style.transition = "none";
    
      animationID = requestAnimationFrame(animation);
    });
    
    carousel.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
    });
    
    carousel.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      cancelAnimationFrame(animationID);
    
      const movedBy = currentX - startX;
      const threshold = carousel.offsetWidth / 4;
    
      activeSlide.style.transition = "transform 0.3s ease";
      nextSlide.style.transition = "transform 0.3s ease";
    
      if (movedBy < -threshold) {
        currentIndex = (currentIndex + 1) % slides.length;
      } else if (movedBy > threshold) {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      }
    
      showSlide(currentIndex);
      activeSlide = null;
      nextSlide = null;
    });
    
    carousel.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        cancelAnimationFrame(animationID);
        if (activeSlide) activeSlide.style.transition = "transform 0.3s ease";
        if (nextSlide) nextSlide.style.transition = "transform 0.3s ease";
        setSlidePositions(0);
      }
    });

    // Visa första bilden
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
