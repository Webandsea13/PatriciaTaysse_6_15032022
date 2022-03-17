//importation model
const Sauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {
	const sauce = new Sauce({ ...req.body.sauce });
	sauce
		.save()
		.then(() => {
			res.status(201).json({ message: "Sauce enregistrée dans la DB" });
		})
		.catch((error) =>
			res.status(400).json({ error: "Impossible d enregistrer la sauce" })
		);
};

exports.readAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};
