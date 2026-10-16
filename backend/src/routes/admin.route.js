const router = require('express').Router();
const auth = require('../controllers/admin-auth.controller');
const admin = require('../controllers/admin.controller');
const { getAdminStory, saveStory } = require('../controllers/story.controller');
const { requireAdmin, requireSuperAdmin } = require('../middleware/auth');

router.post('/auth/login', auth.login);
router.post('/auth/logout', auth.logout);
router.get('/auth/me', requireAdmin, auth.me);

router.use(requireAdmin);
router.get('/story', getAdminStory);
router.put('/story/:slug', saveStory);
router.get('/dashboard', admin.dashboard);
router.get('/bookings', admin.listBookings);
router.patch('/bookings/:id', admin.updateBooking);
router.get('/contacts', admin.listContacts);
router.patch('/contacts/:id', admin.updateContact);
router.get('/settings', admin.getSettings);
router.put('/settings', requireSuperAdmin, admin.updateSettings);
router.get('/:resource', admin.listResource);
router.post('/:resource', admin.createResource);
router.patch('/:resource/:id', admin.updateResource);
router.delete('/:resource/:id', requireSuperAdmin, admin.deleteResource);

module.exports = router;
