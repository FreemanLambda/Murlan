const express = require('express');
const router = express.Router();
const winston = require('winston');

/**
 * Load all controllers
 */
// NOTE: no additional controllers needed

/**
 * Define routes that have not been handled by specific controllers
 */
router.get('/', (req, res) => {
  winston.log('info', 'Got req');
  res.write('Welcome to Murlan');
  res.send();
});

module.exports = router;
