let addHandlers = true;

// Get all item elements from the document
for (let item of document.querySelectorAll(".rlg-item")) {
	// Add refresh event listener
	if (addHandlers) {
		// Create an observer instance
		let observer = new MutationObserver(function (mutations) {
			console.log("changed: " + mutations);
		});
		// Pass in the target node, as well as the observer options
		observer.observe(item, {
			attributes: true,
			childList: true,
			characterData: true
		});
	}
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
		// Get the item name div
		let nameDiv = item.querySelector(".rlg-item__text");
		if (nameDiv == null) { break; }
		// Get the item name text
		let itemText = nameDiv.querySelector(".rlg-item__name");
		if (itemText == null) { continue; }

		getItemValues(newLink, platforms.PC, (itemValue) => {
			// Create the price label (a)
			let priceLabel = document.createElement("a");
			priceLabel.classList = "rlge-a-item-value-trades rlg-item__cert";
			if (itemValue != null && itemValue.minPrice != null && itemValue.maxPrice != null) {
				priceLabel.textContent = itemValue.minPrice + " - " + itemValue.maxPrice;
			}
			// If the item doesn't have a price
			else {
				priceLabel.textContent = "No Price";
			}

			// Add the label to the document
			nameDiv.insertBefore(priceLabel, null);
		})
	}
}

// Don't create handlers again
addHandlers = false;