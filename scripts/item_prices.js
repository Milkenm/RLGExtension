const platforms = {
	PC: "pc",
	PSN: "psn",
	XBOX: "xbox",
	SWITCH: "switch"
};

function getCurrentUnix() {
	return Math.floor(Date.now() / 1000);
}

function unixToDays(unixTimestamp, offset) {
	return Math.floor((unixTimestamp + offset) / 86400000);
}

class ItemValue {
	constructor() {
		// Create new ItemValue
		if (arguments.length == 7) {
			this.itemUrl = arguments[0];
			this.minPrice = arguments[1];
			this.maxPrice = arguments[2];
			this.avgPrice = arguments[3];
			this.craftPrice = arguments[4];
			this.minBpPrice = arguments[5];
			this.maxBpPrice = arguments[6];
			this.retrieveUnix = getCurrentUnix();
		}
		// Instanciate an existing ItemValue
		else if (arguments.length == 1) {
			this.itemUrl = arguments[0].itemUrl;
			this.minPrice = arguments[0].minPrice;
			this.maxPrice = arguments[0].maxPrice;
			this.avgPrice = arguments[0].avgPrice;
			this.craftPrice = arguments[0].craftPrice;
			this.minBpPrice = arguments[0].minBpPrice;
			this.maxBpPrice = arguments[0].maxBpPrice;
			this.retrieveUnix = arguments[0].retrieveUnix;
		}
	}

	needsUpdate() {
		return unixToDays(this.retrieveUnix, 7200) < unixToDays(getCurrentUnix(), 0);
	}
}

const items = document.querySelectorAll(".rlg-item");
for (let item of items) {
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
			// Create the price label
			let priceLabel = document.createElement("a");
			priceLabel.classList = "rlge-a-item-value rlg-item__cert";
			if (itemValue.minPrice != null && itemValue.maxPrice != null) {
				priceLabel.textContent = itemValue.minPrice + " - " + itemValue.maxPrice;
			}
			else {
				priceLabel.textContent = "No Price";
			}

			links.insertBefore(priceLabel, links[0]);
		});
	}
}

// Converts URLs from rocket-league.com to rl.insider.gg
function convertUrl(url) {
	// Ignore fake items from rocket-league.com
	const fakeItems = [
		"bronze-present",
		"common-well",
		"esports-tokens",
		"or",
		"overpay",
		"placeholder",
		"uncommon-drop",
		"credits",
		"credits-offer",
		"africa",
		"asia-and-oceania",
		"eastern-europe",
		"federation-banners",
		"middle-east",
		"north-america",
		"northern-europe",
		"south-america",
		"southern-europe",
		"western-europe",
		"all-stars-cup",
		"challengers-cup",
		"champions-cup",
		"prospects-cup",
		"rare-drop",
		"silver-present",
		"very-rare-drop",
		"import-drop",
		"exotic-drop",
		"gold-present",
		"sp",
		"tickets",
		"black-market-drop",
		"non-crate-import-offer",
		"non-crate-very-rare-offer",
		"non-crate-exotic-offer",
		"offer",
		"very-rare-offer",
		"rare-offer",
		"import-offer",
		"exotic-offer",
		"black-market-offer",
	]
	if (fakeItems.some(fi => url.endsWith("items/misc/" + fi)) || url.endsWith("paintedset")) {
		return null;
	}

	/*
	 * Example decal (Black Market Stride Tide):
	 * RLG: https://rocket-league.com/items/decals/blackmarket/stride-tide
	 * RLI: https://rl.insider.gg/en/pc/decals/stride_tide
	 * 
	 * Example decal 2 (Import Distortion [Dominus])
	 * RLG: https://rocket-league.com/items/decals/dominus/distortion
	 * RLI: https://rl.insider.gg/en/pc/decals/dominus/distortion
	 * 
	 * Example wheels (Exotic Dire Wolf [Black]):
	 * RLG: https://rocket-league.com/items/wheels/dire-wolf
	 * RLI: https://rl.insider.gg/en/pc/wheels/dire_wolf/black
	 * 
	 * Example crate (Golden Gift '22):
	 * RLG: https://rocket-league.com/items/misc/golden-gift-22
	 * RLI: https://rl.insider.gg/en/pc/crates/golden_gift_22
	 */

	// Replace base URL
	let newUrl = url.replace("https://rocket-league.com/items/", "https://rl.insider.gg/en/<platform>/");

	const replacements = [
		/*
		 * Colors
		 */
		["titaniumwhite", "white"],
		["skyblue", "sblue"],
		["burntsienna", "sienna"],
		["forestgreen", "fgreen"],
		/* 
		 * Sub-types
		 */
		["-roasted", "/roasted"],
		["-obverse", "/obverse"],
		["-inverted", "/inverted"],
		["-infinite", "/infinite"],
		["-cystalized", "/crystalized"],
		["-holographic", "/holographic"],
		["-glitched", "/glitched"],
		["-revolved", "/revolved"],
		["-hatch", "/hatch"],
		["-radiant", "/radiant"],
		["-sacred", "/sacred"],
		["-remixed", "/remixed"],
		["-flare", "/flare"],
		["-schematized", "/schematized"],
		["-multichrome", "/multichrome"],
		["-scorched", "/scorched"],
		["-frozen", "/frozen"],
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
		["blackmarket/", ""],
		["global/", ""],
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
		["jakd", "jak_d"],
		["smore", "s_more"],
		["widows_web", "widow_s_web"],
		["pirates_hat", "pirate_s_hat"],
		["chefs_hat", "chef_s_hat"],
		["witchs_hat", "witch_s_hat"],
		["bobs_ramen", "bob_s_ramen"],
		["devils_advocate", "devil_s_advocate"],
		["captains_hat", "captain_s_hat"],
		["sloths_hat", "slot_s_hat"],
		["new_years_2017", "new_year_s_2017"],
		["daves_bread", "dave_s_bread"],
		["winters_warmth", "winter_s_warmth"]
	];
	for (let i = 0; i < replacements.length; i++) {
		newUrl = newUrl.replaceAll(replacements[i][0], replacements[i][1]);
	}

	// Pixelated Shades
	if (newUrl.includes("pixelated_shades") && !newUrl.includes("multichrome")) {
		newUrl = newUrl.replace("pixelated_shades", "pixelated_shades/rare");
	}

	// Alpha + Beta Rewards
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

function getItemValues(url, platform, callback) {
	url = url.replace("<platform>", platform);
	let proxyUrl = 'https://corsproxy.milkenm.workers.dev/?' + encodeURIComponent(url);
	// Get value from localStorage
	let localItem = localStorage.getItem("rlge_" + url);
	if (localItem != null) {
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
			if (response.status != 200) {
				if (response.status == 503) {
					return getItemValues(url, platform, callback);
				}
				/*return getItemValues(url, platform, callback);*/
				return null;
			}
			response.text().then((text) => {
				// Get item cost
				let itemCostStr = text.substring(
					text.indexOf("currentPriceRange") + 20,
					text.indexOf("currentPriceRange") + 35,
				);
				let itemCost = "";
				for (let c of itemCostStr) {
					if (c == "\"") break;
					itemCost += c;
				}

				// Get crafting cost
				let craftingCostStr = text.substring(
					text.indexOf("ingameViewContainerDesktop") - 97,
					text.indexOf("ingameViewContainerDesktop") - 90
				)
				let craftingCost = "";
				for (let c of craftingCostStr) {
					if (c == "<") break;
					craftingCost += c;
				}

				// Calculate values
				let splitPrice = itemCost.split(" - ");
				let minPrice = parseInt(splitPrice[0]);
				let maxPrice = parseInt(splitPrice[1]);
				let avgPrice = (minPrice + maxPrice) / 2;
				let craftPrice = parseInt(craftingCost);
				let minBpPrice = minPrice - craftPrice;
				let maxBpPrice = maxPrice - craftPrice;

				let iv = new ItemValue(url, minPrice, maxPrice, avgPrice, craftPrice, minBpPrice, maxBpPrice);
				localStorage.setItem("rlge_" + url, JSON.stringify(iv));
				callback(iv);
			});
		})
		.catch((error) => {
			// Error loading item
		});
}