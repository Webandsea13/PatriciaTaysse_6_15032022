//importation model
const Sauce = require("../models/sauce");

//importation fs pour gérer la suppression des fichiers image
const fs = require("fs");

//CRUD sauces

exports.createSauce = (req, res, next) => {
	//On doit parser ce qui est dans la requete car il y a aussi le fichier image
	//requete sous forme formdata et pas Json
	const saucefront = JSON.parse(req.body.sauce);

	const sauce = new Sauce({
		...saucefront,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: [],
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
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
	//trouver d'abord la sauce et son fichier image
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				//mettre à jour la sauce en gérant avec fichier ou sans fichier

				//est-ce qu'il y a un fichier image dans la req ?
				const saucefront = req.file
					? {
							...JSON.parse(req.body.sauce),
							imageUrl: `${req.protocol}://${req.get(
								"host"
							)}/images/${req.file.filename}`,
					  }
					: { ...req.body };
				Sauce.updateOne(
					{ _id: req.params.id },
					{ ...saucefront, _id: req.params.id }
				)
					.then(() =>
						res
							.status(200)
							.json({ message: "La sauce a été modifiée." })
					)
					.catch((error) =>
						res.status(400).json({
							error: error,
							message: "Impossible de modifier la sauce.",
						})
					);
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.updateSauce2 = (req, res, next) => {
	if (req.file) {
		//trouver d'abord la sauce et son fichier image
		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				const filename = sauce.imageUrl.split("/images/")[1];
				fs.unlink(`images/${filename}`, (error) => {
					if (error) throw error;
				});
			})
			.catch((error) => res.status(500).json({ error }));
	}

	//mettre à jour la sauce en gérant avec fichier ou sans fichier

	//est-ce qu'il y a un fichier image dans la req ?
	const saucefront = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	Sauce.updateOne(
		{ _id: req.params.id },
		{ ...saucefront, _id: req.params.id }
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
	//trouver la sauce à supprimer pour suppprimer aussi le fichier correspondant
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				//supprimer la sauce (fonction callback de unlink)
				Sauce.deleteOne({ _id: req.params.id })
					.then(() =>
						res
							.status(200)
							.json({ message: "La sauce a été supprimée" })
					)
					.catch((error) =>
						res.status(400).json({
							error: error,
							message: "Impossible de supprimer la sauce.",
						})
					);
			});
		})
		.catch((error) => res.status(500).json({ error }));
};
