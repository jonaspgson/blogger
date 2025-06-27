/* Split post title into subheading */

const headlineElement = document.querySelector(".entry-title");
if (headlineElement) {
  const text = headlineElement.textContent;
  const parts = text.split("—");

  if (parts.length === 2) {
    headlineElement.innerHTML = `${parts[0].trim()} <span class="subheadline">– ${parts[1].trim()}</span>`;
  }
}


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
