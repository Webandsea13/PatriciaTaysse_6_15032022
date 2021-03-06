const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
	try {
		//recupération token dans le authorization du header de la requete login
		//(split crée un tableau des éléments de authorization en enlevant les espaces,  et on récupère le deuxième élément du tableau)
		const tokenAuth = req.headers.authorization.split(" ")[1];
		//decoder le token
		const decodedToken = jwt.verify(tokenAuth, `${process.env.KEY_TOKEN}`);
		//récupérer le userId qui est associé au token
		const userIdfromtoken = decodedToken.userId;
		//on envoie l'userId dans la req pour pouvoir l'utiliser dans les controllers
		req.token = { userId: userIdfromtoken };

		next();
	} catch (error) {
		res.status(401).json({
			error: error,
			message: "Requête non authentifiée",
		});
	}
};
