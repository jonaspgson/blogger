

/* Accordion - requires additional CSS. */

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
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


/* Image carousel - requires additional CSS. */

  document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".carousel");

    carousels.forEach((carousel) => {
      const slides = carousel.querySelectorAll(".slide");
      let currentIndex = 0;

      // Make button left
      const leftBtn = document.createElement("button");
      leftBtn.className = "button button-left";
      carousel.appendChild(leftBtn);

      // Make button right
      const rightBtn = document.createElement("button");
      rightBtn.className = "button button-right";
      carousel.appendChild(rightBtn);

      // Function for displaying the selected slide
      function showSlide(index) {
        slides.forEach((slide, i) => {
          slide.style.display = i === index ? "block" : "none";
        });
      }

      // Eventlisteners
      leftBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
      });

      rightBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
      });

      // Show the first slide
      showSlide(currentIndex);
    });
  });


/* GAMMAL KOD
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("slide");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}
*/
