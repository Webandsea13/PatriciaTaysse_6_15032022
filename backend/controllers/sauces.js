//importation model
const Sauce = require("../models/sauce");

//CRUD sauces

exports.createSauce = (req, res, next) => {
	//spread du req.body et ajout de la clé imageUrl et de sa valeur
	const sauce = new Sauce({
		...req.body.sauce,
		//imageUrl: `${req.protocol}://${req.get("host")}/images/${
		//	req.file.filename
		//}`,
	});
	sauce
		.save()
		.then(() => {
			res.status(201).json({ message: "Sauce enregistrée dans la DB" });
		})
		.catch((error) =>
			res.status(400).json({
				error: error,
				message: "Impossible d enregistrer la sauce",
			})
		);
};

exports.readAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) =>
			res.status(400).json({
				error: error,
				message: "Impossible d accéder aux sauces. ",
			})
		);
};

exports.readOneSauce = (req, res, next) => {
	//on trouve l'id dans les params de  la requete mais sans l'underscore : il faut le rajouter
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) =>
			res.status(404).json({
				error: error,
				message: "impossible d afficher la sauce.",
			})
		);
};

exports.updateSauce = (req, res, next) => {
	Sauce.updateOne(
		{ _id: req.params.id },
		{ ...req.body.sauce, _id: req.params.id }
	)
		.then(() =>
			res.status(200).json({ message: "La sauce a été modifiée." })
		)
		.catch((error) =>
			res.status(400).json({
				error: error,
				message: "Impossible de modifier la sauce.",
			})
		);
};

exports.deleteSauce = (req, res, next) => {
	Sauce.deleteOne({ _id: req.params.id })
		.then(() =>
			res.status(200).json({ message: "La sauce a été supprimée" })
		)
		.catch((error) =>
			res.status(400).json({
				error: error,
				message: "Impossible de supprimer la sauce.",
			})
		);
};
