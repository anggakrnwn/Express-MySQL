const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");

router.post("/register", AuthController.register);
router.post('/register-admin', AuthController.registerAdmin);
router.post("/login", AuthController.login);

module.exports = router;
