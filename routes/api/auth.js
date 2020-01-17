const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");

// @PUBLIC
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;
