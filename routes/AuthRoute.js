const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const auth = require('./../middleware/Authenticate');
const authAgent = auth.authenticateAgent;
const authSuperAgent = auth.authenticateSuperAgent;
const authModerator = auth.authenticateModerator;
const authUser = auth.authenticateUser;

router.post('/registerSuperAgent',authModerator,authController.registerSuperAgent);
router.post('/registerAgent',authSuperAgent,authController.registerAgent);
router.post('/registerUserByAgent',authAgent,authController.registerUserByAgent);
router.post('/login',authController.login);
router.post('/userLogin',authController.userLogin);
router.post('/userGetTables',authUser,authController.userGetTables);
module.exports = router;