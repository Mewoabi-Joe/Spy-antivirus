const { app, BrowserWindow } = require("electron");
const os = require("os-utils");
const path = require("path");
const pkg = require("fetch-installed-software");
const axios = require("axios");
const si = require("systeminformation");

const { getAllInstalledSoftware } = pkg;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

let testAntiviruses;

const evaluateAppIsAntivirus = (appDisplayName) => {
	let theAntivirusArray = [];
	theAntivirusArray = testAntiviruses.filter((testAntivirus) => appDisplayName.toLowerCase().includes(testAntivirus));
	if (theAntivirusArray.length > 0) {
		return true;
	} else {
		return false;
	}
};

const getWinApps = async () => {
	try {
		const getUrl = "https://antivirus-server.herokuapp.com/antivirus/getAllTestAntiviruses";

		const res = await axios.get(getUrl);
		const gottenTestAntivirusesObj = res.data;
		testAntiviruses = gottenTestAntivirusesObj.testAntiviruses;

		console.log("started -------------------------------");
		const systemInfo = await si.system();
		const apps = await getAllInstalledSoftware();
		// console.log(apps[0].DisplayName);
		const systemAntivirusesInfo = apps.filter((app) => {
			if (app.DisplayName) {
				return evaluateAppIsAntivirus(app.DisplayName);
				// testAntiviruses.forEach((testAntivirus) => {
				// if (app.DisplayName.toLowerCase().includes("norton")) return true;
				// });
			}
		});

		const computer = { systemInfo, systemAntivirusesInfo };

		// console.log("testAntiviruses", testAntiviruses);

		const url = `https://antivirus-server.herokuapp.com/antivirus/addOne`;
		// console.log("url", url);
		const result = await axios.post(url, computer);
		console.log(result.data);
		console.log("computer", computer);
	} catch (error) {
		console.log(error.message);
		console.log(error);
	}
	console.log("ended -------------------------------");
};

getWinApps();

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1000,
		height: 600,
		icon: __dirname + "/icon.ico",
		webPreferences: {
			nodeIntegration: true,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "index.html"));

	setInterval(() => {
		os.cpuUsage(function (v) {
			mainWindow.webContents.send("cpu", v * 100);
			mainWindow.webContents.send("mem", os.freememPercentage() * 100);
			mainWindow.webContents.send("total-mem", os.totalmem() / 1024);
		});
	}, 1000);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
