const router = require('express').Router(); const { createContact } = require('../controllers/contact.controller'); router.post('/', createContact); module.exports = router;
