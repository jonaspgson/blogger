//<![CDATA[

/* Requires Font-Awesome and additional CSS. */
function rateThis(n) {
	var startWrap = "<div class='rating'>";
	var endWrap = "</div>"
	var rating = "";
            
	for(i = 1; i <= 5; i++) {
		if(n >= i) {
			rating += '<span class="fa fa-star checked"></span>';
		}
		else {
			rating += '<span class="fa fa-star"></span>';
		}
	}

	document.write(startWrap + rating + endWrap);
} 


function showcaseAlbum(artist,title,imageUrl,theme='') {

	var output = ``;
	
	output += `<div class="img-container ${theme}">`;
	output += `<div class="img"><img src="${imageUrl}" alt="${artist} - ${title} album cover"></div>`;
	output += `<div class="text">`;
	output += `<h3>${title}</h3>by ${artist}`;
	output += getAmazonLinks(`${artist} - ${title}`);
	output += `</div></div>`;

	console.log(output);
	document.write(output);
}


function showcaseProduct(title,subtitle,imageUrl,theme='') {

	var output = ``;
	
	output += `<div class="img-container ${theme}">`;
	output += `<div class="img"><img src="${imageUrl}" alt="${title} - ${subtitle} product image"></div>`;
	output += `<div class="text">`;
	output += `<h3>${title}</h3>${subtitle}`;
	output += getAmazonLinks(`${title} ${subtitle}`);
	output += `</div></div>`;

	console.log(output);
	document.write(output);
}

//Amazon Associate Tags
const AMZ_COM_AT = 'jonzaasprytte-20';
const AMZ_CA_AT  = 'thejo07f-20';
const AMZ_UK_AT  = 'thejo-21';
const AMZ_DE_AT  = 'thejo0b-21';
const AMZ_SE_AT  = '&tag=thejo06-21';


function getAmazonLinks(productName) {

    var searchString = productName.replace(/ /g, "+");

    var output='<h4>Get it on Amazon</h4><div class="link-buttons"><p>Check Price and Availability:</p>';

    output += '<a href="https://www.amazon.com/s?k='   + searchString + '&tag=' + AMZ_COM_AT + '" target="_blank" title="Buy from the USA"><span class="flag-icon flag-icon-us"></span> US</a>';
    output += '<a href="https://www.amazon.ca/s?k='    + searchString + '&tag=' + AMZ_CA_AT  + '" target="_blank" title="Buy from Canada"><span class="flag-icon flag-icon-ca"></span> CA</a>';
    output += '<a href="https://www.amazon.co.uk/s?k=' + searchString + '&tag=' + AMZ_UK_AT  + '" target="_blank" title="Buy from the UK"><span class="flag-icon flag-icon-gb"></span> UK</a>';
    output += '<a href="https://www.amazon.de/s?k='    + searchString + '&tag=' + AMZ_DE_AT  + '" target="_blank" title="Buy from Germany"><span class="flag-icon flag-icon-de"></span> DE/EU</a>';
    output += '<a href="https://www.amazon.se/s?k='    + searchString + '&tag=' + AMZ_SE_AT  + '" target="_blank" title="Buy from Sweden"><span class="flag-icon flag-icon-se"></span> SE</a>';

    output += '<a href="https://www.ebay.com/sch/i.html?_nkw=' + searchString +'&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5338818368&customid=&toolid=10001&mkevt=1" target="_blank" title="Buy Used on eBay"><i class="fab fa-ebay"></i> Buy Used</a>';

    output += '</div><p class="amazon-disclaimer">(As an Amazon and eBay Associate, I earn from qualifying purchases.)</p>';

    return output;
}


function createAmazonLinks(productName) {
	document.write(getAmazonLinks(productName));
}

function createCompactAmazonLinks(productName) {
    var searchString = productName.replace(/ /g, "+");
    var output='<div class="link-buttons-compact">';
    output += '<a href="https://www.amazon.com/s?k='   + searchString + '&tag=' + AMZ_COM_AT + '" target="_blank" title="Buy from the USA"><span class="flag-icon flag-icon-us"></span></a>';
    output += '<a href="https://www.amazon.ca/s?k='    + searchString + '&tag=' + AMZ_CA_AT  + '" target="_blank" title="Buy from Canada"><span class="flag-icon flag-icon-ca"></span></a>';
    output += '<a href="https://www.amazon.co.uk/s?k=' + searchString + '&tag=' + AMZ_UK_AT  + '" target="_blank" title="Buy from the UK"><span class="flag-icon flag-icon-gb"></span></a>';
    output += '<a href="https://www.amazon.de/s?k='    + searchString + '&tag=' + AMZ_DE_AT  + '" target="_blank" title="Buy from Germany"><span class="flag-icon flag-icon-de"></span></a>';
    output += '<a href="https://www.amazon.se/s?k='    + searchString + '&tag=' + AMZ_SE_AT  + '" target="_blank" title="Buy from Sweden"><span class="flag-icon flag-icon-se"></span></a>';
    output += '<a href="https://www.ebay.com/sch/i.html?_nkw=' + searchString +'&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5338818368&customid=&toolid=10001&mkevt=1" target="_blank" title="Buy Used on eBay"><i class="fab fa-ebay"></i></a>';
    output += '</div>';
    document.write(output);
}


/* Light YouTube Embeds by @labnol */
/* Web: https://www.labnol.org/ */

function labnolIframe(div) {
	var iframe = document.createElement("iframe");
	iframe.setAttribute(
	  "src",
	  "https://www.youtube.com/embed/" + div.dataset.id + "?autoplay=1&rel=0"
	);
	iframe.setAttribute("frameborder", "0");
	iframe.setAttribute("allowfullscreen", "1");
	iframe.setAttribute(
	  "allow",
	  "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
	);
	div.parentNode.replaceChild(iframe, div);
  }
  
  function initYouTubeVideos() {
	var playerElements = document.getElementsByClassName("youtube-player");
	for (var n = 0; n < playerElements.length; n++) {
	  var videoId = playerElements[n].dataset.id;
	  var div = document.createElement("div");
	  div.setAttribute("data-id", videoId);
	  var thumbNode = document.createElement("img");
	  thumbNode.src = "https://i.ytimg.com/vi/ID/hqdefault.jpg".replace(
		"ID",
		videoId
	  );
	  div.appendChild(thumbNode);
	  var playButton = document.createElement("div");
	  playButton.setAttribute("class", "play");
	  div.appendChild(playButton);
	  div.onclick = function () {
		labnolIframe(this);
	  };
	  playerElements[n].appendChild(div);
	}
  }
  
  document.addEventListener("DOMContentLoaded", initYouTubeVideos);



//]]>
