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

        const jobs = await Job.find(query)
            .populate('applications.student', '_id')
            .sort({ createdAt: -1 });

        // Filter out applications with deleted students for each job before sending
        const sanitizedJobs = jobs.map(job => {
            const jobObj = job.toObject();
            jobObj.applications = jobObj.applications.filter(app => app.student !== null);
            return jobObj;
        });

        res.json(sanitizedJobs);
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

        // Filter out applications where the student record has been deleted
        job.applications = job.applications.filter(app => app.student !== null);

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

        // If status is being updated to closed, clear applications
        if (req.body.status && req.body.status === 'closed') {
            req.body.applications = [];
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

        // Populate student data before returning
        const populatedJob = await Job.findById(req.params.id)
            .populate('applications.student', 'fullName email mobile department cgpa skills');

        res.json(populatedJob);
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
                if (app.student) {
                    allApplications.push({
                        _id: app._id,
                        jobId: job._id,
                        companyName: job.companyName,
                        role: job.role,
                        student: app.student,
                        status: app.status,
                        appliedAt: app.appliedAt
                    });
                }
            });
        });

        res.json(allApplications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private/Student
exports.applyForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.status !== 'open') {
            return res.status(400).json({ msg: 'Job is no longer open for applications' });
        }

        // Check if student has already applied
        const alreadyApplied = job.applications.find(
            app => app.student.toString() === req.user.id
        );

        if (alreadyApplied) {
            return res.status(400).json({ msg: 'You have already applied for this job' });
        }

        // Add user to applications
        job.applications.push({
            student: req.user.id
        });

        await job.save();
        res.json({ msg: 'Applied successfully', job });
    } catch (err) {
        console.error('Error in applyForJob:', err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Withdraw application
// @route   DELETE /api/jobs/:id/withdraw
// @access  Private/Student
exports.withdrawApplication = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Check if student has applied
        const applicationIndex = job.applications.findIndex(
            app => app.student.toString() === req.user.id
        );

        if (applicationIndex === -1) {
            return res.status(400).json({ msg: 'Application not found' });
        }

        // Remove application
        job.applications.splice(applicationIndex, 1);
        await job.save();

        res.json({ msg: 'Application withdrawn successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAppliedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            'applications.student': req.user.id
        }).sort({ createdAt: -1 });

        // Map to return only relevant data for the student
        const applications = jobs.map(job => {
            const application = job.applications.find(
                app => app.student.toString() === req.user.id
            );
            return {
                _id: job._id,
                companyName: job.companyName,
                role: job.role,
                location: job.location,
                status: application.status,
                appliedAt: application.appliedAt,
                // Add status for open/closed to allow decision making if needed
                jobStatus: job.status
            };
        });

        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get job by ID (Public/Student - No sensitive applicant data)
// @route   GET /api/jobs/:id
// @access  Private/Student
exports.getJobByIdPublic = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
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
