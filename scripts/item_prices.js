const platforms = {
	PC: "pc",
	PSN: "psn",
	XBOX: "xbox",
	SWITCH: "switch"
};

const itemTypes = {
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

getItemValues("stride_tide", itemTypes.DECAL, colors.UNPAINTED, platforms.PC, (itemValue) => {
	console.log(itemValue);
});

function getItemInfo(rlgUrl) {
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
	 */

}

function getItemValues(itemInfo, platform, callback) {
	let url = "https://api.codetabs.com/v1/proxy/?quest=rl.insider.gg/en/" + platform + "/" + itemInfo.itemType + "/" + itemInfo.itemName;
	if (itemInfo.itemColor != colors.UNPAINTED) {
		url += "/" + itemInfo.itemColor;
	}
	console.log("Url: " + url);
	fetch(url)
		.then((response) => {
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
				console.log("item cost: " + itemCost);

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
				console.log("crafting cost: " + craftingCost)

				// Calculate values
				let splitPrice = itemCostStr.split(" - ");
				let minPrice = parseInt(splitPrice[0]);
				let maxPrice = parseInt(splitPrice[1]);
				let avgPrice = (minPrice + maxPrice) / 2;
				let craftPrice = parseInt(craftingCost);
				let bpPrice = maxPrice - craftPrice;

				console.log("return");

				let iv = new ItemValue(minPrice, maxPrice, avgPrice, craftPrice, bpPrice);
				callback(iv);
			});
		})
		.catch((error) => {
			console.log("There was a problem obtaining price info for item:\n" + error);
		});
}

class ItemDetails {
	constructor(itemName, itemType, itemColor, car) {
		this.car = car;
		this.itemName = itemName;
		this.itemType = itemType;
		this.itemColor = itemColor;
	}

	displayInfo() {
		return "Item name: " + this.itemName
			+ "\nItem type: " + this.itemType
			+ "\nItem Color: " + this.itemColor
			+ "\nCar: " + this.car;
	}
}

class ItemValue {
	constructor(minPrice, maxPrice, avgPrice, craftPrice, bpPrice) {
		this.minPrice = minPrice;
		this.maxPrice = maxPrice;
		this.avgPrice = avgPrice;
		this.craftPrice = craftPrice;
		this.bpPrice = bpPrice;
	}

	displayInfo() {
		return "Minimum price: " + this.minPrice
			+ "\nMaximum price: " + this.maxPrice
			+ "\nAverage price: " + this.avgPrice
			+ "\nCrafting Cost: " + this.craftPrice
			+ "\nBlueprint Value: " + this.bpPrice;
	}
}