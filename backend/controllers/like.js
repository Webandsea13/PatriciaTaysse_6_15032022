//importation model
const Sauce = require("../models/sauce");

exports.likeDislikeSauce = async (req, res, next) => {
	try {
		const sauce = await Sauce.findOne({ _id: req.params.id });
		//*****LIKE*** */
		//like=1
		//l'utilisateur aime une première fois
		//on vérifie qu'il n'est pas dans le tableau contenant les userId qui ont déjà aimé
		if (
			!sauce.usersLiked.includes(req.body.userId) &&
			req.body.like === 1
		) {
			try {
				await Sauce.updateOne(
					{ _id: req.params.id },
					{
						$inc: { likes: 1 },
						$push: { usersLiked: req.body.userId },
					}
				);
				return res.status(201).json({ message: "like ajouté" });
			} catch (error) {
				return res.status(400).json({
					error: error,
					message: "impossible de liker",
				});
			}
		}

		//like=0
		//l'utilisateur appuie sur like pour disliker
		//on vérifie qu'il est  dans le tableau et on l'enlève
		if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
			Sauce.updateOne(
				{ _id: req.params.id },
				{
					$inc: { likes: -1 },
					$pull: { usersLiked: req.body.userId },
				}
			)
				.then(() => {
					//console.log(sauce);
					res.status(201).json({ message: "like enlevé" });
				})
				.catch((error) =>
					res.status(400).json({
						error: error,
						message: "impossible d'annuler le like",
					})
				);
		}

		//********DISLIKE*** */

		//like=-1
		//l'utilisateur n'aime pas une première fois
		//on vérifie qu'il n'est pas dans le tableau contenant les userId qui ont déjà disliké
		if (
			!sauce.usersDisliked.includes(req.body.userId) &&
			req.body.like === -1
		) {
			Sauce.updateOne(
				{ _id: req.params.id },
				{
					$inc: { dislikes: 1 },
					$push: { usersDisliked: req.body.userId },
				}
			)
				.then(() => {
					//console.log(sauce);
					res.status(201).json({ message: "dislike ajouté" });
				})
				.catch((error) =>
					res.status(400).json({
						error: error,
						message: "impossible de disliker",
					})
				);
		}

		//like=0
		//l'utilisateur rappuie sur dislike pour annuler son dislike
		//on vérifie qu'il est  dans le tableau et on l'enlève
		if (
			sauce.usersDisliked.includes(req.body.userId) &&
			req.body.like === 0
		) {
			Sauce.updateOne(
				{ _id: req.params.id },
				{
					$inc: { dislikes: -1 },
					$pull: { usersDisliked: req.body.userId },
				}
			)
				.then(() => {
					//console.log(sauce);
					res.status(201).json({ message: "dislike enlevé" });
				})
				.catch((error) =>
					res.status(400).json({
						error: error,
						message: "impossible d'annuler le dislike",
					})
				);
		}
	} catch (error) {
		return res.status(404).json({
			error: error,
			message: "Action impossible",
		});
	}
};
