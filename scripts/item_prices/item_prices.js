// Get all item elements from the document
for (let item of document.querySelectorAll(".rlg-item")) {
	// Get links
	let links = item.querySelector(".rlg-item-links");
	if (links == null) { break; }
	// Get "Item Details" button
	let primary = links.querySelector(".rlg-btn-primary");
	if (primary == null) { continue; }
	// Get button href
	let link = primary.href;
	let newLink = convertUrl(link);
	// Check if the link/item is valid
	if (newLink != null) {
		getItemValues(newLink, platforms.PC, (itemValue) => {
			// Create the price label (a)
			let priceLabel = document.createElement("a");
			priceLabel.classList = "rlge-a-item-value rlg-item__cert";
			if (itemValue != null && itemValue.minPrice != null && itemValue.maxPrice != null) {
				priceLabel.textContent = itemValue.minPrice + " - " + itemValue.maxPrice;
			}
			// If the item doesn't have a price
			else {
				priceLabel.textContent = "No Price";
			}

			// Add the label to the document
			links.insertBefore(priceLabel, null);
		});
	}
}