const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { route } = require("./listing");
const passport = require("passport");
const {saveRedirecturl} = require("../middleware");
const userController = require("../controllers/users");

router
.route("/signup")
.get(userController.signupForm)
.post(userController.signup);


router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirecturl, passport.authenticate("local",{failureRedirect:"/login", failureFlash: true}),userController.login);

router.get("/logout",userController.logout);

module.exports = router;