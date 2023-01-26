// Get the current unix timestamp (in seconds)
function getCurrentUnix() {
	return Math.floor(Date.now() / 1000);
}

// Get the amount of days from 1970 until now
function unixToDays(unixTimestamp, offset) {
	return Math.floor((unixTimestamp + offset) / 86400000);
}