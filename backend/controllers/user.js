//importation model
const User = require("../models/user");

//importation bcrypt
const bcrypt = require("bcrypt");

//fonction signup pour enregistrer un nouvel utilisateur
exports.signup = (req, res, next) => {
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});

			//envoyer le user dans la base de données
			user.save()
				.then(() =>
					res.status(201).json({ message: "Utilisateur créé." })
				)
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};

exports.login = (req, res, next) => {
	//chercher si utilisateur bien présent dans base de données
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({
					error: "Vous devez d'abord vous inscrire pour vous connecter.",
				});
			}

			//controler validité du password
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({
							error: "Le mot de passe est incorrect.",
						});
					}
					res.status(200).json({ message: "Mot de passe correct." });
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
