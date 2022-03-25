const express = require("express");
const router = express.Router();

//importation du controller user
const saucesController = require("../controllers/sauces");
//importation du controller pour les like
const likeController = require("../controllers/like");

//importation du middleware d'authentification
const authorize = require("../middleware/authorize");
//importation du middleware multer pour la gestion des fichiers image
const multer = require("../middleware/multer-config");

//Les routes
//envoyer une sauce
router.post("/", authorize, multer, saucesController.createSauce);

//afficher toutes les sauces
router.get("/", authorize, saucesController.readAllSauce);

//afficher une sauce
router.get("/:id", authorize, saucesController.readOneSauce);

//modifier une sauce
router.put("/:id", authorize, multer, saucesController.updateSauce);

//supprimer une sauce
router.delete("/:id", authorize, saucesController.deleteSauce);

//gestion des like
router.post("/:id/like", authorize, likeController.likeDislikeSauce);

module.exports = router;
