const { exec } = require("child_process");
const colors = require("colors");
const fs = require("fs");

process.stdin.resume(); // This might cause issues

console.clear();
console.log("+------------------------------------+");
console.log("| " + "Wiimote Band Hero Driver for Linux".green + " |");
console.log("+------------------------------------+");
console.log("");
console.log("Finding Wiimote...");
exec("xwiishow list", (error, stdout, stderr) => {
	if (error) throw error;
	if (stderr) throw stderr;

	console.log(stdout.grey);

	let splitByLine = stdout.split("\n");
	let found = false;
	for (let i = 0; i < splitByLine.length; i++) {
		if (splitByLine[i].match(/Found device #1/g)) {
			let pathToMote = extractPath(splitByLine[i]);
			console.log("Found path to Wiimote: " + pathToMote);
			waitForGuitar(pathToMote);
			found = true;
		}
	}
	if (!found) throw new Error("No Wiimote Found");
});

function extractPath(foundString) {
	const splitStr = foundString.split(" ");
	return splitStr[splitStr.length - 1];
}

function waitForGuitar(path) {
	let initalSearch = searchForGuitar(path);
	if (initalSearch === null) {
		console.log("No Guitar found, rerun when plugged in".red);
		process.exit(1);
	} else {
		console.log("Guitar located at ".green + initalSearch);
		startGuitarDaemon(initalSearch);
	}
}

function searchForGuitar(path) {
	let guitarInputPath = null;

	console.log("Searching for guitar...".gray);
	let inputsToSearch = fs.readdirSync(path + "/input");
	for (let i = 0; i < inputsToSearch.length; i++) {
		console.log("Searching ".gray + inputsToSearch[i].gray);
		if (
			fs
				.readFileSync(`${path}/input/${inputsToSearch[i]}/name`, "utf-8")
				.match(/Nintendo Wii Remote Guitar/g)
		) {
			// Found the guitar

			// Search through all files looking for one that starts with event
			let filesInDeviceFolder = fs.readdirSync(
				`${path}/input/${inputsToSearch[i]}`
			);
			for (let l = 0; l < filesInDeviceFolder.length; l++) {
				if (filesInDeviceFolder[l].match(/event[1-9]/g)) {
					guitarInputPath = "/dev/input/" + filesInDeviceFolder[l];
				}
			}
		}
	}

	return guitarInputPath;
}

function startGuitarDaemon(devicePath) {
	console.log("Starting Guitar Daemon".green);
	let input = fs.createReadStream(devicePath);
	input.on("data", (chunk) => {
		console.clear();
		let data = chunk.toJSON().data;
		// for (let i = 0; i < data.length; i++) {
		// 	console.log("IN" + i + ":" + data[i]);
		// }

		// data[18] says what's beeing interacted with (frets, strum, whammy, etc...)
		// data[20] determines how far pressed down it is. Buttons go 0-1 and whammy goes 0-8 in intervals of 2

		console.log("Pressed: " + data[20]);

		switch (data[18]) {
			case 1:
				console.log("GREEN");
				break;
			case 2:
				console.log("RED");
				break;
		}
	});
}
