let allAntiviruses;
const mainEle = document.querySelector("main");
const headerEle = document.querySelector("body > div > header");
const noAntiEle = document.getElementById("noOfSpiedOnComputers");
const aside1 = document.querySelector("body > div > div > aside > h4:nth-child(1)");
const aside2 = document.querySelector("body > div > div > aside > h4.mt-5.text-center");
const latestSpyTimeEle = document.getElementById("latestSpyTime");
let passedAntivirus;

const loadInitialHeading = () => {
	headerEle.innerHTML = `<h2>ALL COMPUTERS SPIED ON</h2>`;
	aside1.innerText = "NUMBER OF COMPUTERS";
	aside2.innerText = "LATEST COMPUTER SCAN TIME";
};

const loadContent = (i) => {
	headerEle.innerHTML = `<span class="h2">COMPUTER AND ANTIVIRUS DETAILS</span><span style="position:absolute; left: 20px; top: 10px"><button onClick="loadScreen1()" class="btn btn-light" >Back to all spied computers</button></span>`;
	passedAntivirus = allAntiviruses[i];
	aside1.innerText = "NUMBER OF ANTIVIRUSES";
	noAntiEle.innerText = passedAntivirus.systemAntivirusesInfo.length > 1 ? "2" : "1";
	aside2.innerText = "ANTIVIRUS UPDATE TIME";
	latestSpyTimeEle.innerText = formattedDateFromBDProp(passedAntivirus.updatedAt);

	console.log("passedAntivirus", passedAntivirus);
	mainEle.innerHTML =
		passedAntivirus.systemAntivirusesInfo.length != 0
			? `
    <div class="details ms-5">
            <h3 class="display-6 text-center" style="background-color: rgb(209, 235, 197)">
                PC INFORMATION
            </h3>
			<div class="row mb-5 justify-content-between">
                <div class="col">
                    <div>Manufacturer: <span class="h5">${passedAntivirus.systemInfo.manufacturer}</span></div>
                    <div>Model: <span class="h5">${passedAntivirus.systemInfo.model}</span></div>
                    <div>Version: <span class="h5">${passedAntivirus.systemInfo.version}</span></div>
                    <div>Serial: <span class="h5">${passedAntivirus.systemInfo.serial}</span></div>
                    <div>uuid: <span class="h5">${passedAntivirus.systemInfo.uuid}</span></div>
                   
                <div/>
            </div>
            <h3 class="display-6 text-center mt-4" style="background-color: rgb(209, 235, 197)">
                PC ANTIVIRUS INFORMATION
            </h3>
			<div class="row">
                <div class="col">
                    <p class="m-0">Name:    <span class="h5">${
											passedAntivirus.systemAntivirusesInfo[0].DisplayName
										}</span></p>
                    <p class="m-0">Version:    <span class="h5">${
											passedAntivirus.systemAntivirusesInfo[0].DisplayVersion
										}</span></p>
                    <p class="m-0">Publisher:    <span class="h5">${
											passedAntivirus.systemAntivirusesInfo[0].Publisher
										}</span></p>
                    <p class="m-0">Install location:    <span class="h5">${
											passedAntivirus.systemAntivirusesInfo[0].InstallLocation
										}</span></p>
                </div>
            </div>
            ${displaySecond()}
		</div>
`
			: `
		<div class="details ms-5">
		<h3 class="display-6 text-center" style="background-color: rgb(209, 235, 197)">
			PC INFORMATION
		</h3>
		<div class="row mb-5 justify-content-between">
			<div class="col">
				<div>Manufacturer: <span class="h5">${passedAntivirus.systemInfo.manufacturer}</span></div>
				<div>Model: <span class="h5">${passedAntivirus.systemInfo.model}</span></div>
				<div>Version: <span class="h5">${passedAntivirus.systemInfo.version}</span></div>
				<div>Serial: <span class="h5">${passedAntivirus.systemInfo.serial}</span></div>
				<div>uuid: <span class="h5">${passedAntivirus.systemInfo.uuid}</span></div>
			
			<div/>
		</div>
		<h3 class="display-6 text-center mt-4" style="background-color: rgb(209, 235, 197)">
			PC ANTIVIRUS INFORMATION
		</h3>
		<div class="row">
			<div class="col">
				<p class="m-0">Name:    <span class="h5">Windows Defender</span></p>
				 
				<p class="m-0">Publisher:    <span class="h5">Microsoft</span></p>
				 
			</div>
		</div>
		${displaySecond()}
		</div>									
`;
};

const formattedDateFromBDProp = (prop) => {
	let latest = new Date(prop);
	latest = latest.toDateString() + " " + latest.toLocaleTimeString();
	return latest;
};

const getAntiviruses = async () => {
	mainEle.innerHTML = `
	<div class="text-center mt-5">
	<div class="spinner-border" role="status">
  		<span class="visually-hidden">Loading...</span>
	</div>
	</div>
	`;
	const res = await axios.get("https://antivirus-server.herokuapp.com/antivirus/getAll");
	allAntiviruses = res.data.antivirus;
	// console.log("allAntiviruses", allAntiviruses);
	noAntiEle.innerText = `${allAntiviruses.length}`;
	latestSpyTimeEle.innerText = formattedDateFromBDProp(allAntiviruses[0].updatedAt);
	mainEle.innerHTML = "";
	for (i = 0; i < allAntiviruses.length; i++) {
		mainEle.innerHTML += `<a id=${i} onClick="loadContent(${i})"
        class="text-decoration-none antivirus row justify-content-center align-items-center mt-4 border border-2 border-success  border-rounded-pill mx-5 py-3 shadow"
        style="border-radius: 10px; cursor: pointer; height: 100px"
    >
        <div class="col  h4">${allAntiviruses[i].systemInfo.manufacturer}</div>
        <div class="col pe-5  h4">${allAntiviruses[i].systemInfo.model}</div>
        <div class="col ps-3 h5">${allAntiviruses[i].systemInfo.serial}</div>
        <div class="col h5">${formattedDateFromBDProp(allAntiviruses[i].updatedAt)}</div>
        
    </a>`;
	}
};

const displaySecond = () => {
	if (passedAntivirus.systemAntivirusesInfo.length > 1) {
		return `<div class="row mt-4">
                <div class="col">
                    <p class="m-0">Name:    <span class="h5">${passedAntivirus.systemAntivirusesInfo[1].DisplayName}</span></p>
                    <p class="m-0">Version:    <span class="h5">${passedAntivirus.systemAntivirusesInfo[1].DisplayVersion}</span></p>
                    <p class="m-0">Publisher:    <span class="h5">${passedAntivirus.systemAntivirusesInfo[1].Publisher}</span></p>
                    <p class="m-0">Install location:    <span class="h5">${passedAntivirus.systemAntivirusesInfo[1].InstallLocation}</span></p>
                </div>
            </div>`;
	} else {
		return "<div></div>";
	}
};

const loadScreen1 = () => {
	loadInitialHeading();
	getAntiviruses();
};

loadScreen1();
