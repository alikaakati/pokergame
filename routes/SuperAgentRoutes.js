const express = require('express');
const superagentController = require('../controllers/superAgentController');
const router = express.Router();
const auth = require('../middleware/Authenticate');
const authSuperAgent = auth.authenticateSuperAgent;

router.post('/depositUSDFundsToAgent',authSuperAgent,superagentController.depositUSDFundsToAgent);
router.post('/depositLBPFundsToAgent',authSuperAgent,superagentController.depositLBPFundsToAgent);
router.post('/withdrawUSDFundsFromAgent',authSuperAgent,superagentController.withdrawUSDFundsFromAgent);
router.post('/withdrawLBPFundsFromAgent',authSuperAgent,superagentController.withdrawLBPFundsFromAgent);

module.exports = router;