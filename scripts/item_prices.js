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
	let links = items[i].getElementsByClassName("rlg-item-links")[0];
	let primary = links.getElementsByClassName("rlg-btn-primary")[0];
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

	// Colors
	newUrl = newUrl.replace("titaniumwhite", "white")
		.replace("skyblue", "sblue")
		.replace("burntsienna", "sienna")
		.replace("forestgreen", "fgreen");
	// Replace sub-types
	newUrl = newUrl.replace("-roasted", "/roasted")
		.replace("-obverse", "/obverse")
		.replace("-inverted", "/inverted")
		.replace("-infinite", "/infinite")
		.replace("-cystalized", "/crystalized")
		.replace("-holographic", "/holographic")
		.replace("-glitched", "/glitched")
		.replace("-revolved", "/revolved")
		.replace("-hatch", "/hatch")
		.replace("-radiant", "/radiant")
		.replace("-sacred", "/sacred")
		.replace("-remixed", "/remixed")
		.replace("-flare", "/flare")
		.replace("-schematized", "/schematized")
		.replace("-multichrome", "/multichrome")
		.replace("-scorched", "/scorched")
		.replace("-frozen", "/frozen");
	// Repalce - with _
	newUrl = newUrl.replaceAll("-", "_");

	// Crates
	if (newUrl.includes("misc")) {
		/*
		 * https://rocket-league.com/items/misc/golden-egg-18
		 */
		newUrl = newUrl.replace("misc", "crates");
	}

	// Bodies
	else if (newUrl.includes("bodies")) {
		/*
		 * https://rocket-league.com/items/bodies/fennec
		 * https://rocket-league.com/items/bodies/fennec/titaniumwhite
		 */
		newUrl = newUrl.replace("bodies", "cars");
	}

	// Decals
	else if (newUrl.includes("blackmarket") || newUrl.includes("global")) {
		/* 
		 * https://rocket-league.com/items/decals/blackmarket/20xx
		 * https://rocket-league.com/items/decals/blackmarket/20xx/black
		 * https://rocket-league.com/items/decals/global/swirls
		 * https://rocket-league.com/items/decals/octane/tumbling-blocks
		 * https://rocket-league.com/items/decals/octane/tumbling-blocks/black
		 */

		newUrl = newUrl.replace("blackmarket/", "")
			.replace("global/", "");
	}

	// Paint Finishes
	else if (newUrl.includes("paints")) {
		/*
		 * https://rocket-league.com/items/paints/chipboard
		 */
		newUrl = newUrl.replace("paints", "paint_finishes");
	}

	// Wheels
	else if (newUrl.includes("wheels")) {
		/*
		 * https://rocket-league.com/items/wheels/automaton
		 * https://rocket-league.com/items/wheels/automaton/black
		 * https://rocket-league.com/items/wheels/automaton-inverted
		 * https://rocket-league.com/items/wheels/automaton-inverted/black
		 */
	}

	// Boosts
	else if (newUrl.includes("boosts")) {
	}

	// Toppers
	else if (newUrl.includes("toppers")) {
	}

	// Antennas
	else if (newUrl.includes("antennas")) {
	}

	// Goal Explosions
	else if (newUrl.includes("explosions")) {
		newUrl = newUrl.replace("explosions", "goal_explosions");
	}

	// Trails
	else if (newUrl.includes("trails")) {
	}

	// Engine Audios
	else if (newUrl.includes("engines")) {
		newUrl = newUrl.replace("engines", "engine_sounds");
	}

	// Player Banners
	else if (newUrl.includes("banners")) {
		type = types.BANNER;
	}

	// Avatar Borders
	else if (newUrl.includes("borders")) {
		newUrl = newUrl.replace("borders", "avatar_borders");
	}

	return newUrl;
}

function getItemValues(url, platform, callback) {
	url = url.replace("<platform>", platform);
	let proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
	fetch(proxyUrl)
		.then((response) => {
			if (!response.status != 200) {
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