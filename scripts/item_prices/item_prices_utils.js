const platforms = {
	PC: "pc",
	PSN: "psn",
	XBOX: "xbox",
	SWITCH: "switch"
};

class ItemValue {
	constructor() {
		// Create new ItemValue
		if (arguments.length == 2) {
			this.minPrice = arguments[0];
			this.maxPrice = arguments[1];
			this.retrieveUnix = getCurrentUnix();
		}
		// Instanciate an existing ItemValue
		else if (arguments.length == 1) {
			this.minPrice = arguments[0].minPrice;
			this.maxPrice = arguments[0].maxPrice;
			this.retrieveUnix = arguments[0].retrieveUnix;
		}
	}

	needsUpdate() {
		return unixToDays(this.retrieveUnix, 7200) < unixToDays(getCurrentUnix(), 0);
	}
}

// Converts URLs from rocket-league.com to rl.insider.gg
function convertUrl(url) {
	// Ignore fake items from rocket-league.com
	const fakeItems = [
		"common-well",
		"or", "overpay", "placeholder",
		"credits", "credits-offer", "esports-tokens", "sp", "tickets",
		"africa", "asia-and-oceania", "eastern-europe", "federation-banners", "middle-east", "north-america", "northern-europe",
		"south-america", "southern-europe", "western-europe",
		"all-stars-cup", "challengers-cup", "champions-cup", "prospects-cup",
		"bronze-present", "silver-present", "gold-present",
		"uncommon-drop", "rare-drop", "very-rare-drop", "import-drop", "exotic-drop",
		"black-market-drop",
		"non-crate-uncommon-offer", "non-crate-rare-offer", "non-crate-very-rare-offer", "non-crate-import-offer", "non-crate-exotic-offer", "offer",
		"uncommon-offer", "rare-offer", "very-rare-offer", "import-offer", "exotic-offer", "black-market-offer", "limited-offer"
	]
	if (fakeItems.some(fi => url.endsWith("items/misc/" + fi)) || url.endsWith("paintedset")) {
		return null;
	}

	// Replace base URL
	let newUrl = url.replace("https://rocket-league.com/items/", "https://rl.insider.gg/en/<platform>/");

	const replacements = [
		/*
		 * Colors
		 */
		["titaniumwhite", "white"], ["skyblue", "sblue"], ["burntsienna", "sienna"], ["forestgreen", "fgreen"],
		/* 
		 * Sub-types
		 */
		["-roasted", "/roasted"], ["-obverse", "/obverse"], ["-inverted", "/inverted"], ["-infinite", "/infinite"],
		["-cystalized", "/crystalized"], ["-holographic", "/holographic"], ["-glitched", "/glitched"], ["-revolved", "/revolved"],
		["-hatch", "/hatch"], ["-radiant", "/radiant"], ["-sacred", "/sacred"], ["-remixed", "/remixed"], ["-flare", "/flare"],
		["-schematized", "/schematized"], ["-multichrome", "/multichrome"], ["-scorched", "/scorched"], ["-frozen", "/frozen"],
		/*
		 * Replace - with _
		 */
		["-", "_"],
		/*
		 * Crates
		 * https://rocket-league.com/items/misc/golden-egg-18
		 */
		["misc", "crates"],
		/*
		 * Bodies
		 * https://rocket-league.com/items/bodies/fennec
		 * https://rocket-league.com/items/bodies/fennec/titaniumwhite
		 */
		["bodies", "cars"],
		/*
		 * Decals
		 * https://rocket-league.com/items/decals/blackmarket/20xx
		 * https://rocket-league.com/items/decals/blackmarket/20xx/black
		 * https://rocket-league.com/items/decals/global/swirls
		 * https://rocket-league.com/items/decals/octane/tumbling-blocks
		 * https://rocket-league.com/items/decals/octane/tumbling-blocks/black
		 */
		["blackmarket/", ""], ["global/", ""],
		/*
		 * Paint Finishes
		 * https://rocket-league.com/items/paints/chipboard
		 */
		["paints", "paint_finishes"],
		/*
		 * Goal Explosions
		 */
		["explosions", "goal_explosions"],
		/*
		 * Engine Audios
		 */
		["engines", "engine_sounds"],
		/*
		 * Avatar Borders
		 */
		["borders", "avatar_borders"],
		/*
		 * This: '
		 */
		["jakd", "jak_d"], ["smore", "s_more"], ["widows_web", "widow_s_web"], ["pirates_hat", "pirate_s_hat"], ["chefs_hat", "chef_s_hat"],
		["witchs_hat", "witch_s_hat"], ["bobs_ramen", "bob_s_ramen"], ["devils_advocate", "devil_s_advocate"], ["captains_hat", "captain_s_hat"],
		["sloths_hat", "slot_s_hat"], ["new_years_2017", "new_year_s_2017"], ["daves_bread", "dave_s_bread"], ["winters_warmth", "winter_s_warmth"]
	];
	for (let i = 0; i < replacements.length; i++) {
		newUrl = newUrl.replaceAll(replacements[i][0], replacements[i][1]);
	}

	// Pixelated Shades
	if (newUrl.includes("pixelated_shades") && !newUrl.includes("multichrome")) {
		newUrl = newUrl.replace("pixelated_shades", "pixelated_shades/rare");
	}

	// Alpha and Beta Rewards
	if (newUrl.includes("aplha_reward") || newUrl.includes("beta_reward")) {
		let rewardSplit = newUrl.split("/");
		let itemName = rewardSplit[rewardSplit.length - 1];
		let nameSplit = itemName.split("_");
		let newName = "";
		for (let i = 0; i < nameSplit.length; i++) {
			if (rewardSplit[i] == "alpha" || rewardSplit[i] == "beta") {
				break;
			}
			if (newName != "") {
				newName += "_";
			}
			newName += rewardSplit[i];
		}
		newUrl = newUrl.replace(itemName, newName);
	}

	return newUrl;
}

// Get the minimum and maximum price for an item from a rl.insider.gg URL
function getItemValues(url, platform, callback) {
	url = url.replace("<platform>", platform);
	let proxyUrl = 'https://corsproxy.milkenm.workers.dev/?' + encodeURIComponent(url);
	// Get value from localStorage
	let localItem = localStorage.getItem("rlge_" + url);
	if (localItem != null && false) {
		let parsedItem = new ItemValue(JSON.parse(localItem));
		// Check if the localStorage was fetched the previous day
		if (!parsedItem.needsUpdate()) {
			callback(parsedItem);
			return;
		}
	}
	// Get value from rl.insider.gg
	fetch(proxyUrl)
		.then((response) => {
			// Failed to get item info
			if (response.status != 200) {
				// Service unavailable
				if (response.status == 503) {
					// Attempt to get item info again
					return getItemValues(url, platform, callback);
				}
				callback(null);
				return null;
			}
			// After getting the info
			response.text().then((text) => {
				// Get all lines from the response
				let splitLines = text.split("\n");
				for (let line of splitLines) {
					// Check if it's the line with the item data variable (const itemData)
					if (line.includes("const itemData")) {
						// Format the string
						let splitLine = line.split("const itemData = ");
						let jsonString = splitLine[1].slice(0, -1);

						// Convert the string to an object
						let obj = JSON.parse(jsonString);

						// Get the price
						let currentPrice = obj.currentPriceRange;
						// Remove all spaces and dots from the price string
						currentPrice = currentPrice.replaceAll(" ", "").replaceAll(".", "");

						// Calculate the item price multiplier case the price has "k" or "million" (alpha items)
						let multiplier = 1;
						// Has thousands
						if (currentPrice.includes("k")) {
							currentPrice = currentPrice.replaceAll("k", "");
							multiplier = 1_000;
						}
						// Has millions
						else if (currentPrice.includes("million")) {
							currentPrice = currentPrice.replaceAll("million", "");
							multiplier = 1_000_000;
						}

						// The price is a string "20 - 40", so we split into "20 " and " 40" (with the spaces)
						let priceSplit = obj.currentPriceRange.split("-");
						// Get minimum and maximum price, multiplying it if needed.
						let minPrice = parseInt(priceSplit[0]) * multiplier;
						let maxPrice = parseInt(priceSplit[1]) * multiplier;

						// Create a new ItemValue object
						let itemValue = new ItemValue(minPrice, maxPrice);
						localStorage.setItem("rlge_" + url.replace("https://rl.insider.gg/en/", ""), JSON.stringify(itemValue));
						callback(itemValue);
						return;
					}
				}
			});
		})
		.catch((error) => {
			// Error loading item
			callback(null);
			return null;
		});
}