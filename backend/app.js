//importations
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const helmet = require("helmet");

//accéder au path pour les images
const path = require("path");

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
app.use(helmet());

//importation des routes
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

//gérer les problèmes de CORS (cross origin request sharing)
app.use((req, res, next) => {
	res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
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

//route authentification signup et login
app.use("/api/auth", userRoutes);

//routes sauces
//créer une sauce
app.use("/api/sauces", saucesRoutes);

//routes images
app.use("/images", express.static(path.join(__dirname, "images")));

//gestion erreur globale
app.use(function (err, req, res, next) {
	res.status(500).send("Something broke!");
});

module.exports = app;
