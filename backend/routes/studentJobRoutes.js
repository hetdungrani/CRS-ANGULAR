const express = require('express');
const router = express.Router();
const { getJobs, getJobById, applyForJob, getAppliedJobs } = require('../controllers/jobController');
const auth = require('../middleware/auth');

// All routes are private
router.use(auth);

router.get('/', getJobs);
router.get('/applied', getAppliedJobs);
router.get('/:id', getJobById);
router.post('/:id/apply', applyForJob);

module.exports = router;
