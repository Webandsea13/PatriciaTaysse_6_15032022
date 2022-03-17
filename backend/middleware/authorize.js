const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		//recupération token dans le header de la requete (split enlève l'espace, et on récupère le deuxième élément du tableau)
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, `${process.env.KEY_TOKEN}`);
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw "userId non valable";
		} else {
			next();
		}
	} catch (error) {
		res.status(401).json({ error: error | "Requête non identifiée" });
	}
};
