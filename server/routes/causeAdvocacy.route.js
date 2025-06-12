const express = require('express');
const router = express.Router();
const { createCauseAdvocacy, getCauseAdvocacies, updateCauseAdvocacy, deleteCauseAdvocacy } = require('../controllers/advocacy.controller');
const { isKYCVerified } = require('../middlewares/auth.middleware');

router.post('/', isKYCVerified, createCauseAdvocacy);
router.get('/', getCauseAdvocacies);
router.put('/:id', isKYCVerified, updateCauseAdvocacy);
router.delete('/:id', isKYCVerified, deleteCauseAdvocacy);

module.exports = router;
