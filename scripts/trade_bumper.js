// Get the "select all trades" checkbox
const referenceCheckbox = document.getElementById("rlg-trade-select-all");

// Create the "Bump All" button
let bumpAllButton = document.createElement("button");
bumpAllButton.textContent = "Bump All";
bumpAllButton.id = "rlge-bump-all-trades-btn";
bumpAllButton.classList = "rlge-btn-bump-all-trades rlg-btn-primary";
// "Bump All" button click
bumpAllButton.addEventListener("click", () => {
	const bumpDelay = 1300;

	// Get all "Bump" buttons
	let bumpButtons = document.getElementsByClassName("rlg-trade__bump");

	const successPopup = document.getElementsByClassName("rlg-site-popup")[0];
	successPopup.style.display = "none";

	// Click all "Bump" buttons with a 1.3s delay inbetween
	for (let i = 0; i < bumpButtons.length; i++) {
		setTimeout(() => {
			bumpButtons[i].click();
		}, i * bumpDelay);
	}

	setTimeout(() => {
		successPopup.style.display = null;
		alert("Bumped all trades.");
	}, bumpButtons.length - 1 * bumpDelay);
});

// Check if the checkbox was found
if (referenceCheckbox) {
	// Get the checkbox's parent div
	let div = referenceCheckbox.parentElement;

	// Add the "Bump All" button to the page
	div.insertBefore(bumpAllButton, referenceCheckbox.nextSibling);
}