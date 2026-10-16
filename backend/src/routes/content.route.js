const router = require('express').Router();
const c = require('../controllers/content.controller');
const { getStory } = require('../controllers/story.controller');

router.get('/settings', c.getPublicSettings); 
router.get('/campaigns', c.listCampaigns);
router.get('/story', getStory);
router.get('/workshops', c.listWorkshops);
router.get('/posts', c.listPosts);
router.get('/posts/:slug', c.getPost);
router.get('/gallery', c.listGallery);

module.exports = router;
