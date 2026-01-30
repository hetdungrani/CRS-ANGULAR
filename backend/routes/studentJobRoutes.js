const express = require('express');
const router = express.Router();
const { getJobs, getJobById, getJobByIdPublic, applyForJob, getAppliedJobs, withdrawApplication } = require('../controllers/jobController');
const auth = require('../middleware/auth');

// All routes are private
router.use(auth);

router.get('/', getJobs);
router.get('/applied', getAppliedJobs);
router.get('/:id', getJobByIdPublic);
router.post('/:id/apply', applyForJob);
router.delete('/:id/withdraw', withdrawApplication);

module.exports = router;
