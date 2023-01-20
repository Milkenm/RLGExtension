const platforms = {
	PC: "pc",
	PSN: "psn",
	XBOX: "xbox",
	SWITCH: "switch"
};

const types = {
	DECAL: "decals",
	CRATE: "crates",
	BODY: "cars",
	PAINT_FINISH: "paint_finishes",
	WHEELS: "wheels",
	BOOST: "boosts",
	TOPPER: "toppers",
	ANTENNA: "antennas",
	GOAL_EXPLOSION: "goal_explosions",
	TRAIL: "trails",
	ENGINE_SOUND: "engine_sounds",
	BANNER: "banners",
	BORDER: "avatar_borders"
};

const subTypes = {
	ROASTED: "roasted",
	OBVERSE: "obvserse",
	INVERTED: "inverted",
	INFINITE: "infinite",
	CRYSTALIZED: "crystalized",
	HOLOGRAPHIC: "holographic",
	GLITCHED: "glitched",
	REVOLVED: "revolved",
	HATCH: "hatch",
	RADIANT: "radiant",
	SACRED: "sacred",
	REMIXED: "remixed",
	FLARE: "flare",
	SCHEMATIZED: "schematized",
	MULTICHROME: "multichrome",
	SCORCHED: "scorched",
	FROZEN: "frozen"
};

const colors = {
	UNPAINTED: "",
	BLACK: "black",
	TITANIUM_WHITE: "white",
	GREY: "grey",
	CRIMSON: "crimson",
	PINK: "pink",
	COBALT: "cobalt",
	SKY_BLUE: "sblue",
	BURNT_SIENNA: "sienna",
	SAFFRON: "saffron",
	LIME: "lime",
	FOREST_GREEN: "fgreen",
	PURPLE: "purple",
	GOLD: "gold"
};

const cars = {
	GLOBAL: "global",
	ANIMUS_GP: "animus_gp",
	DOMINUS: "dominus",
	BREAKOUT: "breakout",
	TAKUMI: "takumi",
	OCTANE: "octane",
	FENNEC: "fennec",
	DOMINUS_GT: "dominus_gt",
	TAKUMI_RX_T: "takumi_rx_t",
	BREAKOUT_TYPE_S: "breakout_type_s",
	OCTANE_ZSR: "octane_zsr"
}

class ItemInfo {
	constructor(itemName, itemType, itemSubType, itemColor, car) {
		this.car = car;
		this.itemName = itemName;
		this.itemType = itemType;
		this.itemSubType = itemSubType;
		this.itemColor = itemColor;
	}

	displayInfo() {
		return "Item Name: " + this.itemName
			+ "\nItem Type: " + this.itemType
			+ "\nItem Sub-Type: " + this.itemSubType
			+ "\nItem Color: " + this.itemColor
			+ "\nCar: " + this.car;
	}
}

class ItemValue {
	constructor(item, minPrice, maxPrice, avgPrice, craftPrice, minBpPrice, maxBpPrice) {
		this.item = item;
		this.minPrice = minPrice;
		this.maxPrice = maxPrice;
		this.avgPrice = avgPrice;
		this.craftPrice = craftPrice;
		this.minBpPrice = minBpPrice;
		this.maxBpPrice = maxBpPrice;
	}

	displayInfo() {
		return "Item: " + this.item
			+ "\nMinimum price: " + this.minPrice
			+ "\nMaximum price: " + this.maxPrice
			+ "\nAverage price: " + this.avgPrice
			+ "\nCrafting Cost: " + this.craftPrice
			+ "\nMinimum Blueprint Value: " + this.minBpPrice
			+ "\nMaximum Blueprint Value: " + this.maxBpPrice;
	}
}

const items = document.getElementsByClassName("rlg-item");

for (i = 0; i < items.length; i++) {
	if (items == null) { break; }
	let links = items[i].getElementsByClassName("rlg-item-links")[0];
	if (links == null) { break; }
	let primary = links.getElementsByClassName("rlg-btn-primary")[0];
	if (primary == null) { continue; }
	let link = primary.href;
	let newLink = getItemInfo(link);
	if (newLink != null) {
		getItemValues(newLink, platforms.PC, (itemValue) => {
			// Create the "Bump All" button
			let bumpAllButton = document.createElement("a");
			bumpAllButton.textContent = itemValue.minPrice + " - " + itemValue.maxPrice;

			links.insertBefore(bumpAllButton, links[0]);
		});
	}
}

function getItemInfo(url) {
	if (url.includes("credits")) {
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

	let replacements = [
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
		console.log("index: " + i);
		console.log("r1: " + replacements[i, 0] + ", r2: " + replacements[i + 1, 1]);
		newUrl = newUrl.replace(replacements[i, 0], replacements[i + 1, 1]);
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
		console.log("new url: " + newUrl);
	}

	return newUrl;
}

function getItemValues(url, platform, callback) {
	url = url.replace("<platform>", platform);
	let proxyUrl = 'https://corsproxy.milkenm.workers.dev/?' + encodeURIComponent(url);
	fetch(proxyUrl)
		.then((response) => {
			if (response.status != 200) {
				if (response.status == 503) {
					return getItemValues(url, platform, callback);
				}
				console.log("There was a problem obtaining price info for item.");
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
				callback(iv);
			});
		})
		.catch((error) => {
			console.log("There was a problem obtaining price info for item:\n" + error);
		});
}