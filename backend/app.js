//importations
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//connexion base de données
mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
	)
	.then(() => console.log("Connexion à mongodb réussie."))
	.catch(() => console.log("Connexion à mongodb échouée"));

//importation fichier database pour connexion à mongoDB
//const mongoose = require("./db/database");

const app = express();
//faire les requetes au format json-(bodyparser inclus dans la version de express)
app.use(express.json());

const userRoutes = require("./routes/user");

//gérer les problèmes de CORS (cross origin request sharing)
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization "
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

// app.use((req, res, next) => {
// 	console.log("première requete");
// 	next();
// });

// app.use((req, res, next) => {
// 	res.json({ message: "ça fonctionne toujours !" });
// 	next();
// });

app.use("/api", userRoutes);

module.exports = app;
