const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    updateApplicantStatus,
    getAllApplications
} = require('../controllers/jobController');
const adminAuth = require('../middleware/adminAuth');

// All routes are private and admin-only
router.use(adminAuth);

router.get('/applications/all', getAllApplications);

router.route('/')
    .get(getJobs)
    .post(createJob);

router.route('/:id')
    .get(getJobById)
    .put(updateJob)
    .delete(deleteJob);

router.put('/:id/applicants/:applicantId', updateApplicantStatus);

module.exports = router;
