// Check if the user is at the trades page
if (window.location.href.startsWith("https://rocket-league.com/trades/")) {
    // Get the "select all trades" checkbox
    const referenceCheckbox = document.getElementById("rlg-trade-select-all");

    // Create the "Bump All" button
    let bumpAllButton = document.createElement("button");
    bumpAllButton.textContent = "Bump All";
    bumpAllButton.id = "rlge-bump-all-trades-btn";
    bumpAllButton.classList = "rlge-btn-bump-all-trades rlg-btn-primary";
    bumpAllButton.addEventListener("click", bumpAllTrades);

    // Check if the checkbox was found
    if (referenceCheckbox)
    {
        // Get the checkbox's parent div
        let div = referenceCheckbox.parentElement;

        // Add the "Bump All" button to the page
        div.insertBefore(bumpAllButton, referenceCheckbox.nextSibling);
    }
}

function bumpAllTrades()
{
    // Get all "Bump" buttons
    let bumpButtons = document.getElementsByClassName("rlg-trade__bump");

    // Click all "Bump" buttons with a 2.5s delay inbetween
    for (let i = 0; i < bumpButtons.length; i++) {
        setTimeout(() => {
            bumpButtons[i].click();
        }, i * 1300);
    }
}