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



function createAmazonLinks(productName) {

    var searchString = productName.replace(/ /g, "+");

    var output='<h4>Get it on Amazon</h4><div class="link-buttons"><p>Check Prices:</p>';

    output += '<a href="https://www.amazon.com/s?k=' + searchString + '&tag=jonzaasprytte-20" target="_blank" title="Buy from the USA"><span class="flag-icon flag-icon-us"></span> US</a>';
    output += '<a href="https://www.amazon.ca/s?k=' + searchString + '&tag=thejo027-20" target="_blank" title="Buy from Canada"><span class="flag-icon flag-icon-ca"></span> CA</a>';
    output += '<a href="https://www.amazon.co.uk/s?k=' + searchString + '&tag=thejo-21" target="_blank" title="Buy from the UK"><span class="flag-icon flag-icon-gb"></span> UK</a>';
    output += '<a href="https://www.amazon.de/s?k=' + searchString + '&tag=thejo0a-21" target="_blank" title="Buy from Germany (recommended for EU citizens)"><span class="flag-icon flag-icon-de"></span><span class="flag-icon flag-icon-eu"></span> DE/EU</a>';
    output += '<a href="https://www.ebay.com/sch/i.html?_nkw=' + searchString +'&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5338818368&customid=&toolid=10001&mkevt=1" target="_blank" title="Buy Used on eBay"><i class="fab fa-ebay"></i> Buy Used</a>'

    output += '</div><p class="amazon-disclaimer">(As an Amazon and eBay Associate, I earn from qualifying purchases.)</p>';

    document.write(output);
}


//]]>
