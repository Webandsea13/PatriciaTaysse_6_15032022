const express = require("express");
const router = express.Router();
//importation du controller user
const userController = require("../controllers/user");

//route signup
router.post("/auth/signup", userController.signup);

//route login
router.post("/auth/login", userController.login);

module.exports = router;
