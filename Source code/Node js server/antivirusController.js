const { Antivirus, TestAntivirus } = require("./antivirusModel");

module.exports.antivirus_get = async (req, res) => {
	try {
		const antivirus = await Antivirus.find().sort({ updatedAt: -1 });
		console.log(antivirus);
		res.status(201).json({ antivirus });
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err.message });
	}
};

//
module.exports.antivirus_post = async (req, res) => {
	try {
		console.log(req.body);
		const computerObj = req.body;
		const systemAntivirusesInfoArray = computerObj.systemAntivirusesInfo;
		const systemAntivirusesInfo = systemAntivirusesInfoArray.map(
			(systemAntivirusInfo) => new Map(Object.entries(systemAntivirusInfo))
		);
		const systemInfo = new Map(Object.entries(computerObj.systemInfo));
		const computerMap = { systemInfo, systemAntivirusesInfo };
		const theAntivirus = await Antivirus.findOne({ "systemInfo.serial": computerObj.systemInfo.serial });
		if (theAntivirus) {
			await Antivirus.updateOne({ _id: theAntivirus._id }, computerMap);
		} else {
			await Antivirus.create(computerMap);
		}
		res.status(201).json({ success: "Added antivirus" });
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err.message });
	}
};

module.exports.test_antivirus_get = async (req, res) => {
	try {
		const testAntivirusesObj = await TestAntivirus.findOne();
		const testAntiviruses = testAntivirusesObj.testAntiviruses;
		res.status(201).json({ testAntiviruses });
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err.message });
	}
};

module.exports.test_antivirus_post = async (req, res) => {
	const sentAntivirus = req.body;
	try {
		let modifiedtestAntiviruses;
		const fountTestAntivirus = await TestAntivirus.findOne();
		if (fountTestAntivirus) {
			const { _id } = fountTestAntivirus;
			modifiedtestAntiviruses = await TestAntivirus.updateOne(
				{ _id },
				{
					$push: {
						testAntiviruses: sentAntivirus.name,
					},
				}
			);
		} else {
			modifiedtestAntiviruses = await TestAntivirus.create({ testAntiviruses: [] });
		}
		res.status(201).json({ modifiedtestAntiviruses });
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err.message });
	}
};
