const express = require('express');
const router = express.Router();
const { registerUser ,loginUser} = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const { registerSchema, loginSchema } = require('../validators/authValidator');

router.post('/register',validateRequest(registerSchema), registerUser);
router.post('/login',validateRequest(loginSchema),loginUser)
module.exports = router;