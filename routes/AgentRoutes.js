const express = require('express');
const agentController = require('../controllers/agentController');
const router = express.Router();
const auth = require('../middleware/Authenticate');
const authAgent = auth.authenticateAgent;

router.post('/depositUSDFundsToAgent',authAgent,agentController.depositUSDFundsToAgent);
router.post('/depositLBPFundsToAgent',authAgent,agentController.depositLBPFundsToAgent);
router.post('/withdrawUSDFundsFromAgent',authAgent,agentController.withdrawUSDFundsFromAgent);
router.post('/withdrawLBPFundsFromAgent',authAgent,agentController.withdrawLBPFundsFromAgent);

module.exports = router;