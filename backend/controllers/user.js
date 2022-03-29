//importation model
const User = require("../models/user");

//importation bcrypt
const bcrypt = require("bcrypt");
//token
const jwt = require("jsonwebtoken");

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
			res.status(500).json({
				error: error,
				message: "impossible de créer utilisateur",
			});
		});
};

exports.login = async (req, res, next) => {
	try {
		//chercher si utilisateur bien présent dans base de données
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(401).json({
				error: "Vous devez d'abord vous inscrire pour vous connecter.",
			});
		}

		//controler validité du password
		const valid = await bcrypt.compare(req.body.password, user.password);
		//mot de passe incorrect
		if (!valid) {
			return res.status(401).json({
				error: "Le mot de passe est incorrect.",
			});
		}
		//utilsateur présent et password correct : envoi dans la réponse du userId et du token
		return res.status(200).json({
			userId: user._id,
			token: jwt.sign({ userId: user._id }, `${process.env.KEY_TOKEN}`, {
				expiresIn: "10h",
			}),
		});
	} catch {
		(error) => {
			return res.status(500).json({ error });
		};
	}
};

// exports.login = (req, res, next) => {
// 	//chercher si utilisateur bien présent dans base de données
// 	User.findOne({ email: req.body.email })
// 		.then((user) => {
// 			if (!user) {
// 				return res.status(401).json({
// 					error: "Vous devez d'abord vous inscrire pour vous connecter.",
// 				});
// 			}

// 			//controler validité du password
// 			bcrypt
// 				.compare(req.body.password, user.password)
// 				.then((valid) => {
// 					//mot de passe incorrect
// 					if (!valid) {
// 						return res.status(401).json({
// 							error: "Le mot de passe est incorrect.",
// 						});
// 					}
// 					//password correct : envoi dans la réponse du userId et du token
// 					res.status(200).json({
// 						userId: user._id,
// 						token: jwt.sign(
// 							{ userId: user._id },
// 							`${process.env.KEY_TOKEN}`,
// 							{ expiresIn: "5h" }
// 						),
// 					});
// 				})
// 				.catch((error) => res.status(500).json({ error }));
// 		})
// 		.catch((error) => res.status(500).json({ error }));
// };
