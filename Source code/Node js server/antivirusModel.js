const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const antivirusSchema = new Schema(
	{
		systemInfo: Map,
		systemAntivirusesInfo: [Map],
	},
	{ timestamps: true }
);

const testAntivirusSchema = new Schema({
	testAntiviruses: [String],
});

const Antivirus = mongoose.model("antivirus", antivirusSchema);
const TestAntivirus = mongoose.model("testAntivirus", testAntivirusSchema);
module.exports = { Antivirus, TestAntivirus };
