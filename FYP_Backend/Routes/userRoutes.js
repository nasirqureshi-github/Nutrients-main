// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserControllers');
const { createuserValidationRules, createuserValidationRules2, loginuserValidationRules, otp, userValidationSchema, } = require('../validators/userValidators');
const { authMiddleware, isAdmin } = require('../Middleware/authMiddleware');

// Route to get all users
router.post('/create', createuserValidationRules(), userController.createUser);
router.post('/login', loginuserValidationRules(), userController.login);
router.post('/signin', loginuserValidationRules(), userController.loginuser);
router.post('/add-admin', authMiddleware, isAdmin, createuserValidationRules2(), userController.addadmin);


router.get('/all-user', authMiddleware, isAdmin, userController.getAllUsers);
router.post('/otp', authMiddleware, otp(), userController.verifyOtp);
router.delete('/delete/:id', authMiddleware, isAdmin, userController.deleteUser);

router.get('/', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userValidationSchema, userController.updateUser);

module.exports = router;
