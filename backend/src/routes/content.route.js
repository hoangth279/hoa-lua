const router = require('express').Router(); const c = require('../controllers/content.controller');
router.get('/campaigns', c.listCampaigns); router.get('/workshops', c.listWorkshops); router.get('/posts', c.listPosts); router.get('/posts/:slug', c.getPost); router.get('/gallery', c.listGallery);
module.exports = router;
