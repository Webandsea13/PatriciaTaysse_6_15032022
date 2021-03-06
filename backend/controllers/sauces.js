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
			res.status(201).json({ message: "Sauce créée." });
		})
		.catch((error) =>
			res.status(400).json({
				error: error,
				message: "Impossible de créer la sauce",
			})
		);
};

exports.readAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) =>
			res.status(400).json({
				error: error,
				message: "Impossible d/' afficher les sauces. ",
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
				message: "impossible d/' afficher la sauce.",
			})
		);
};

exports.updateSauce = async (req, res, next) => {
	//On cherche la sauce à modifier
	const sauceDB = await Sauce.findOne({ _id: req.params.id });
	if (sauceDB == null) {
		return res.status(404).json({ message: "Sauce introuvable." });
	}

	//Vérification de l'autorisation de l'utilisateur
	if (sauceDB.userId !== req.token.userId) {
		return res.status(403).json({
			message: "Vous n'êtes pas autorisé à effectuer cette action.",
		});
	}

	//s'il y a un fichier image dans la req : supprimer l'image actuelle
	if (req.file) {
		try {
			//récupérer le nom du fichier image
			const filename = sauceDB.imageUrl.split("/images/")[1];
			//effacer le fichier image
			fs.unlink(`images/${filename}`, (error) => {
				if (error) throw error;
			});
		} catch (error) {
			return res
				.status(500)
				.json({
					error: error,
					message: "Impossible de remplacer l/'image.",
				});
		}
	}

	//mettre à jour la sauce en gérant avec fichier ou sans fichier
	try {
		//est-ce qu'il y a un fichier image dans la req ?   ?=oui   :=non
		const saucefront = req.file
			? {
					...JSON.parse(req.body.sauce),
					imageUrl: `${req.protocol}://${req.get("host")}/images/${
						req.file.filename
					}`,
			  }
			: { ...req.body };
		await Sauce.updateOne(
			{ _id: req.params.id },
			{ ...saucefront, _id: req.params.id }
		);
		return res.status(200).json({ message: "La sauce a été modifiée." });
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Impossible de modifier la sauce.",
		});
	}
};

exports.deleteSauce = async (req, res, next) => {
	//trouver la sauce à supprimer dans la DB pour suppprimer aussi le fichier correspondant sur le serveur
	try {
		const sauce = await Sauce.findOne({ _id: req.params.id });

		//vérification que userId connecté est identique au userId qui a créé la sauce
		if (sauce.userId !== req.token.userId) {
			return res.status(403).json({
				error: error,
				message: "Vous n'êtes pas autorisé à effectuer cette action.",
			});
		}

		const filename = sauce.imageUrl.split("/images/")[1];
		fs.unlink(`images/${filename}`, async () => {
			try {
				//supprimer la sauce (fonction callback de unlink)
				await Sauce.deleteOne({ _id: req.params.id });
				return res
					.status(200)
					.json({ message: "La sauce a été supprimée." });
			} catch (error) {
				return res.status(400).json({
					error: error,
					message: "Impossible de supprimer la sauce.",
				});
			}
		});
	} catch (error) {
		return res
			.status(500)
			.json({ error: error, message: "Action impossible." });
	}
};

// exports.deleteSauce = (req, res, next) => {
// 	//trouver la sauce à supprimer dans la DB pour suppprimer aussi le fichier correspondant sur le serveur
// 	Sauce.findOne({ _id: req.params.id })
// 		.then((sauce) => {
// 			//vérification que userId connecté est identique au userId qui a créé la sauce
// 			if (sauce.userId === req.token.userId) {
// 				const filename = sauce.imageUrl.split("/images/")[1];
// 				fs.unlink(`images/${filename}`, () => {
// 					//supprimer la sauce (fonction callback de unlink)
// 					Sauce.deleteOne({ _id: req.params.id })
// 						.then(() =>
// 							res
// 								.status(200)
// 								.json({ message: "La sauce a été supprimée" })
// 						)
// 						.catch((error) =>
// 							res.status(400).json({
// 								error: error,
// 								message: "Impossible de supprimer la sauce.",
// 							})
// 						);
// 				});
// 			} else {
// 				throw "Vous n êtes pas autorisé à effectuer cette action.";
// 			}
// 		})
// 		.catch((error) => res.status(500).json({ error }));
// };
