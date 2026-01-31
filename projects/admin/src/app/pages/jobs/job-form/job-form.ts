import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { ToastService } from '../../../components/shared/toast/toast.service';

@Component({
    selector: 'app-job-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './job-form.html',
})
export class JobForm implements OnInit {
    isEdit = false;
    loading = false;
    jobData: any = {
        companyName: '',
        role: '',
        description: '',
        requirements: '',
        eligibility: {
            branches: [],
            minCGPA: 0
        },
        package: '',
        status: 'open',
        lastDate: '',
        location: 'On-site'
    };

    allBranches = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Electrical', 'Civil'];
    selectedBranches: { [key: string]: boolean } = {};

    constructor(
        private jobService: JobService,
        private router: Router,
        private route: ActivatedRoute,
        private toastService: ToastService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            // Use resolved data - no manual API call
            const resolvedJob = this.route.snapshot.data['job'];
            if (resolvedJob) {
                this.loadJobData(resolvedJob);
            } else {
                // Fallback if resolver failed
                this.loadJob(id);
            }
        } else {
            // Initialize checkboxes for new job
            this.allBranches.forEach(b => this.selectedBranches[b] = false);
        }
    }

    loadJobData(data: any) {
        this.jobData = data;
        // Convert date for input type="date"
        if (this.jobData.lastDate) {
            this.jobData.lastDate = new Date(this.jobData.lastDate).toISOString().split('T')[0];
        }
        // Update checkboxes
        this.allBranches.forEach(b => {
            this.selectedBranches[b] = this.jobData.eligibility.branches.includes(b);
        });
    }

    // Fallback method only used if resolver fails
    loadJob(id: string) {
        this.loading = true;
        this.jobService.getJobById(id).subscribe({
            next: (data) => {
                this.loadJobData(data);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                const errorMsg = err.error?.msg || err.message || 'Failed to load job details';
                this.toastService.error(errorMsg);
            }
        });
    }

    onSubmit() {
        // Validate CGPA if provided
        if (this.jobData.eligibility && this.jobData.eligibility.minCGPA !== undefined && this.jobData.eligibility.minCGPA !== null) {
            const cgpa = Number(this.jobData.eligibility.minCGPA);
            if (!Number.isInteger(cgpa) || cgpa < 1 || cgpa > 10) {
                this.toastService.error('Minimum CGPA must be an integer between 1 and 10');
                return;
            }
        }

        // Collect selected branches
        this.jobData.eligibility.branches = Object.keys(this.selectedBranches).filter(b => this.selectedBranches[b]);

        if (this.isEdit) {
            this.jobService.updateJob(this.jobData._id, this.jobData).subscribe({
                next: () => {
                    this.toastService.success('Job updated successfully');
                    this.router.navigate(['/jobs']);
                },
                error: (err) => {
                    const errorMsg = err.error?.msg || err.message || 'Failed to update job';
                    this.toastService.error(errorMsg);
                }
            });
        } else {
            this.jobService.createJob(this.jobData).subscribe({
                next: () => {
                    this.toastService.success('Job created successfully');
                    this.router.navigate(['/jobs']);
                },
                error: (err) => {
                    const errorMsg = err.error?.msg || err.message || 'Failed to create job';
                    this.toastService.error(errorMsg);
                }
            });
        }
    }
}
