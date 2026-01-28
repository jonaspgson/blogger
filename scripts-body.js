document.addEventListener("DOMContentLoaded", () => {
	initBylines();
	initPublishDate();
	initAccordions();
	initImageCarousels();
	initGalleryToggle();
});


/* ------------------- INIT BYLINES -------------------
   Creates byline. Usage: <byline-AUTHOR> tag where AUTHOR works as the ID. 
   Use the optional attribute "data-title" to change the default title in the byline (eg. "Images and Words".) 
*/
function initBylines() {
  const authors = {
    jg: {
      name: "Jonas Gustafsson",
      defaultTitle: "Photos and Words",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh9H20qE_5ZEHBNYVhJNeNqUPCIay0nIBJ-rFN4AMxkKUJiLRGVYh9JRkZxcnhfHUtAo3W01XNNmDRgPK3-FJWG3HQekrOflemh-ETpsdhNNd6w7j_drneEQF8Q4DJnmNpYLSMc2fg_497bopx5_ASgQAm1ncIaBEheEmvRCd5PT61XcePyHx_QwbQkUA/s80/jonas-profile-250.webp",
      links: {
        instagram: "https://www.instagram.com/jonas_thejo",
        tiktok: "https://www.tiktok.com/@crowdsnapper",
        x: "https://x.com/jonasen",
        youtube: "https://www.youtube.com/@jonasthejo"
      }
    },
    x: {
      name: "Guest Writer",
      defaultTitle: "Words",
      /*image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgiX4HO05NoCEM3S3POkmS7QjAnaNS-LFAdtmH5iLW6CaECnQOws_cAXdGoVQXnxwg5Ln9Ph6wc0Rk7K7P5kOIf7Vu1GnGNkZT7tD8hgTVU8iwk7lFdYiy_a_-vzf2DC_tited7LAQokeRbX5WGvCjs4LhVdzE2cn4Jw5hf_rx-Yr7MGmhrCSOFMSejFA/s400-rw/hardcore-superstar-oasen-festival-2025-crowdsnapper-5.webp",*/
      links: {
        instagram: "https://www.instagram.com/agda_art",
        /*x: "https://x.com/agdasvensson",*/
        youtube: "https://www.youtube.com/@agdasvensson"
      }
    }
    // Lägg till fler personer här
  };

  Object.keys(authors).forEach(authorKey => {
	const tagName = `byline-${authorKey}`;
	document.querySelectorAll(tagName).forEach(el => {
	  const author = authors[authorKey];
	  const title = el.dataset.title || author.defaultTitle;
	
	  // 🧠 Hämta fallback-text från markupen
	  const fallbackText = el.textContent.trim();
	
	  // 📦 Skapa byline-section
	  const section = document.createElement("section");
	  section.className = `byline byline-${authorKey}`;
	
	  // 🔒 Lägg till fallback-text som aria-label (för SEO/tillgänglighet)
	  if (fallbackText) {
	    section.setAttribute("aria-label", fallbackText);
	  }

      // Build social links dynamically
      let socialLinks = "";
      if (author.links.facebook) {
        socialLinks += `<a href="${author.links.facebook}" title="Facebook" target="_blank"><i class="fa-brands fa-facebook"></i></a>`;
      }
      if (author.links.instagram) {
        socialLinks += `<a href="${author.links.instagram}" title="Instagram" target="_blank"><i class="fa-brands fa-instagram"></i></a>`;
      }
      if (author.links.tiktok) {
        socialLinks += `<a href="${author.links.tiktok}" title="TikTok" target="_blank"><i class="fa-brands fa-tiktok"></i></a>`;
      }
	  if (author.links.x) {
        socialLinks += `<a href="${author.links.x}" title="X (Twitter)" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>`;
      }
      if (author.links.youtube) {
        socialLinks += `<a href="${author.links.youtube}" title="YouTube" target="_blank"><i class="fa-brands fa-youtube"></i></a>`;
      }

	  // 🖼️ Bild (om så angivits)
	  const imageMarkup = author.image
	    ? `<byline-image><img src="${author.image}" alt="${author.name} byline image" title="${author.name} byline image"></byline-image>`
	    : "";

	  // 🧩 Sätt ihop hela markupen
	  section.innerHTML = `
	    ${imageMarkup}
	    <byline-text>
		  ${title ? `<byline-title>${title}</byline-title>` : ""}
		  <byline-name>${author.name}</byline-name>
		  ${socialLinks ? `<byline-links>${socialLinks}</byline-links>` : ""}
	    </byline-text>
	  `;

	  // 🔄 Ersätt original-elementet
      el.replaceWith(section);
    });
  });
}


/* ---------------- INIT PUBLISH DATE ----------------- */

function initPublishDate() {
  const el = document.getElementById("pub-data");

  // Format ISO → "27 Jan, 2025"
  function formatDate(iso) {
    if (!iso) return null;
    const date = new Date(iso);
    const parts = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).split(" ");
    return `${parts[0]} ${parts[1]}, ${parts[2]}`;
  }

  // --- Hämta Bloggers datum direkt från JSON-LD ---
  function getDatesFromJsonLd() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent);

        // Vi vill bara ha NewsArticle (Blogger desktop)
        if (data["@type"] === "NewsArticle") {
          return {
            published: data.datePublished || null,
            modified: data.dateModified || null
          };
        }
      } catch (e) {
        // Ignorera script som inte är ren JSON
      }
    }
    return { published: null, modified: null };
  }

  const bloggerDates = getDatesFromJsonLd();

  // --- Publiceringsdatum ---
  const published = el?.dataset.published || bloggerDates.published;

  // --- Uppdateringsdatum ---
  const updated = bloggerDates.modified;

  const publishedPretty = formatDate(published);
  const updatedPretty = formatDate(updated);

  // --- Visa <pub-date> ---
  const bylines = document.querySelectorAll(".byline");
  if (bylines.length > 0 && (publishedPretty || updatedPretty)) {
    const lastByline = bylines[bylines.length - 1];
    const infoBox = document.createElement("pub-date");

    let html = "";
    if (publishedPretty) html += `<div class="published-date">Published: ${publishedPretty}</div>`;
    if (updatedPretty) html += `<div class="updated-date">Last Edit: ${updatedPretty}</div>`;

    infoBox.innerHTML = html;
    lastByline.insertAdjacentElement("afterend", infoBox);
  }
}

/*
function initPublishDate() {
	const el = document.getElementById("pub-data");
	if (!el) {
		//console.warn("No pub-data found on this page ❌");
		return;
	}
	
	const published = el.dataset.published;
	const updated = el.dataset.updated;
	
	// --- Helper: format ISO date → "27 Jan, 2025" ---
	function formatDate(iso) {
		if (!iso) return null;
		const date = new Date(iso);
		
		const parts = date.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric"
		}).split(" ");
		// en-GB ger normalt: ["27", "Jan", "2025"]
		
		if (parts.length !== 3) return iso; // fallback om något oväntat händer
		
		return `${parts[0]} ${parts[1]}, ${parts[2]}`;
	}
	
	
	const publishedPretty = formatDate(published);
	const updatedPretty = formatDate(updated);
	
	// --- 1. Insert visual <pub-date> block after last .byline ---
	const bylines = document.querySelectorAll(".byline");
	if (bylines.length > 0 && (publishedPretty || updatedPretty)) {
		const lastByline = bylines[bylines.length - 1];
		const infoBox = document.createElement("pub-date");
		let html = "";
		if (publishedPretty) html += `<div class="published-date">Published: ${publishedPretty}</div>`;
		if (updatedPretty) html += `<div class="updated-date">Last Edit: ${updatedPretty}</div>`;
		infoBox.innerHTML = html;
		lastByline.insertAdjacentElement("afterend", infoBox);
	}

	// --- 2. Generate Schema.org JSON-LD metadata ---
	const headline =
		document.querySelector("h3.post-title, h1.post-title")?.innerText ||
		document.title;
	
	const url = window.location.href;
	
	const authorEl = document.querySelector(".post-author, .fn, .author");
	const author = authorEl ? authorEl.innerText.trim() : "Unknown";
	
	const schema = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		"headline": headline,
		"url": url,
		"author": {
			"@type": "Person",
			"name": author
		}
	};
	
	if (published) schema.datePublished = published;
	if (updated) schema.dateModified = updated;
	
	const script = document.createElement("script");
	script.type = "application/ld+json";
	script.textContent = JSON.stringify(schema, null, 2);
	
	document.body.appendChild(script);
}
*/


/* ---------- INIT Accordion - requires additional CSS. --------------- */

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


/* ------------- INIT Image carousel - requires additional CSS. ----------------- */

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
