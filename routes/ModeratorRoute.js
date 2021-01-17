const express = require('express');
const moderatorController = require('../controllers/moderatorController');
const router = express.Router();
const auth = require('../middleware/Authenticate');
const authModerator = auth.authenticateModerator;

router.post('/depositUSDFundsToSuperAgent',authModerator,moderatorController.depositUSDFundsToSuperAgent);
router.post('/depositLBPFundsToSuperAgent',authModerator,moderatorController.depositLBPFundsToSuperAgent)
router.post('/withdrawLBPFundsFromSuperAgent',authModerator,moderatorController.withdrawLBPFundsFromSuperAgent)
router.post('/withdrawUSDFundsFromSuperAgent',authModerator,moderatorController.withdrawUSDFundsFromSuperAgent)
module.exports = router;