//importation model
const Sauce = require("../models/sauce");

//CRUD sauces

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

exports.readOneSauce = (req, res, next) => {
	//on trouve l'id dans les params de  la requete mais sans l'underscore : il faut le rajouter
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

exports.updateSauce = (req, res, next) => {
	Sauce.updateOne({ _id: req.params.id }, req.body.sauce)
		.then(() =>
			res.status(200).json({ message: "La sauce a été modifiée." })
		)
		.catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
	Sauce.deleteOne({ _id: req.params.id })
		.then(() =>
			res.status(200).json({ message: "La sauce a été supprimée" })
		)
		.catch((error) => res.status(400).json({ error }));
};
