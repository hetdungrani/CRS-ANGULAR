const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'Please add a company name']
    },
    role: {
        type: String,
        required: [true, 'Please add a job role']
    },
    description: {
        type: String,
        required: [true, 'Please add a job description']
    },
    requirements: {
        type: String,
        required: [true, 'Please add job requirements']
    },
    eligibility: {
        branches: {
            type: [String],
            required: [true, 'Please add eligible branches']
        },
        minCGPA: {
            type: Number,
            required: [true, 'Please add minimum CGPA'],
            default: 0
        }
    },
    package: {
        type: String,
        required: [true, 'Please add package details']
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'cancelled'],
        default: 'open'
    },

    location: {
        type: String,
        default: 'On-site'
    },
    applications: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'rejected', 'selected'],
            default: 'applied'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

jobSchema.pre('save', function () {
    if (this.eligibility && Array.isArray(this.eligibility.branches)) {
        this.eligibility.branches = this.eligibility.branches.map(b => {
            const trimmed = b.trim();
            return trimmed.length <= 4 ? trimmed.toUpperCase() : trimmed;
        }).filter(b => b !== '');
    }
});

module.exports = mongoose.model('Job', jobSchema);
