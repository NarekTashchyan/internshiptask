// authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/logout', AuthController.logoutUser);
router.post('/delete', AuthController.deleteUser)
router.post('/retrieve', AuthController.retrieveUserData)
router.put('/update', AuthController.updateUserData)
module.exports = router;

