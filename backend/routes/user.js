const express = require("express");
const router = express.Router();
//importation du controller user
const userController = require("../controllers/user");

//route signup
router.post("/signup", userController.signup);

//route login
router.post("/login", userController.login);

module.exports = router;
