const mongoose = require("mongoose");

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
	)
	.then(() => console.log("Connexion à mongodb réussie."))
	.catch(() => console.log("Connexion à mongodb échouée"));

module.exports = mongoose;
