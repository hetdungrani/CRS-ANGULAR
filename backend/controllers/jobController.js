const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Create new job drive
// @route   POST /api/admin/jobs
// @access  Private/Admin
exports.createJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all job drives
// @route   GET /api/admin/jobs
// @access  Private/Admin
exports.getJobs = async (req, res) => {
    try {
        const { status, company, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (company) query.companyName = new RegExp(company, 'i');
        if (search) {
            query.$or = [
                { companyName: new RegExp(search, 'i') },
                { role: new RegExp(search, 'i') }
            ];
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get job by ID
// @route   GET /api/admin/jobs/:id
// @access  Private/Admin
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('applications.student', 'fullName email mobile department cgpa skills');
        
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update job
// @route   PUT /api/admin/jobs/:id
// @access  Private/Admin
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        await job.deleteOne();
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update applicant status
// @route   PUT /api/admin/jobs/:id/applicants/:applicantId
// @access  Private/Admin
exports.updateApplicantStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        const applicant = job.applications.find(
            app => app._id.toString() === req.params.applicantId
        );

        if (!applicant) {
            return res.status(404).json({ msg: 'Applicant not found' });
        }

        applicant.status = status;
        await job.save();

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// @desc    Get all applications across all jobs
// @route   GET /api/admin/jobs/applications/all
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('applications.student', 'fullName email department cgpa mobile')
            .sort({ createdAt: -1 });

        let allApplications = [];
        jobs.forEach(job => {
            job.applications.forEach(app => {
                allApplications.push({
                    _id: app._id,
                    jobId: job._id,
                    companyName: job.companyName,
                    role: job.role,
                    student: app.student,
                    status: app.status,
                    appliedAt: app.appliedAt
                });
            });
        });

        res.json(allApplications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
