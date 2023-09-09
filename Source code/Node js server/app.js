const express = require("express");
const mongoose = require("mongoose");
const antivirusRoute = require("./antivirusRoute");
const path = require("path");
const cors = require("cors");
const env = require("dotenv");

const app = express();

env.config();

// joe_on_atlas

// middleware
app.use(cors());
app.use(express.json());

console.log("process.env.DATABASE", process.env.DATABASE);
// database connection
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((result) => {
		console.log("connection made to mogodb");
		app.listen(process.env.PORT || 5000);
	})
	.catch((err) => console.log(err));

// // routes
// app.get('*', checkUser);
app.get("/", (req, res) => res.send("Invalid endpoint"));
app.use("/antivirus", antivirusRoute);
