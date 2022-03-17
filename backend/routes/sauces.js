const express = require("express");
const router = express.Router();

//importation du controller user
const saucesController = require("../controllers/sauces");

//Les routes
//envoyer une sauce
router.post("/", saucesController.createSauce);

//afficher toutes les sauces
router.get("/", saucesController.readAllSauce);

module.exports = router;
