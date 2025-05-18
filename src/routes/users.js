const express = require('express')

const UserController = require('../controllers/users')

const router = express.Router();

// create post
router.post('/', UserController.createNewUser)

// read get
router.get('/', UserController.getAllUsers)

// update patch
router.patch('/:id', UserController.updateUser)

// delete delete
router.delete('/:id', UserController.deleteUser)

module.exports = router;