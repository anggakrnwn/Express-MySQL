const express = require("express");
const {
  authenticate,
  authorizeRoles,
  checkOwnerOrAdmin,
} = require("../middleware/auth");
const UserController = require("../controllers/users");

const router = express.Router();

router.use(authenticate);

router.get("/", UserController.getAllUsers);

router.post("/", authorizeRoles(2), UserController.createNewUser);

router.patch("/:id", checkOwnerOrAdmin, UserController.updateUser);

router.delete("/:id", authorizeRoles(2), UserController.deleteUser);

module.exports = router;
