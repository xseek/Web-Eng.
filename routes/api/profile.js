const express = require('express');
const router = express.Router();

// @PUBLIC
router.get('/', (req, res) => res.send('User route'));

module.exports = router;
