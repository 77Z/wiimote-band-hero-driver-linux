const { watch } = require("fs");

let watcher = watch("./directory");

watcher.on("change", (path) => {
	console.log("AA");
});
