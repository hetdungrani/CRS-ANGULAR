import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';

import { take } from 'rxjs';

@Component({
    selector: 'app-job-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './job-detail.html',
})
export class JobDetail implements OnInit {
    job: any;
    loading = false;
    updatingStatus: string | null = null;

    constructor(
        private jobService: JobService,
        private route: ActivatedRoute,

    ) { }

    ngOnInit() {
        // Use resolved data - no manual API call
        this.job = this.route.snapshot.data['job'];
        if (!this.job) {
            // Fallback: if resolver failed or data not available
            const id = this.route.snapshot.paramMap.get('id');
            if (id) {
                this.loadJob(id);
            }
        }
    }

    // Fallback method only used if resolver fails
    loadJob(id: string) {
        this.loading = true;
        this.jobService.getJobById(id).subscribe({
            next: (data) => {
                this.job = data;
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                const errorMsg = err.error?.msg || err.message || 'Failed to load job details';

            }
        });
    }

    updateStatus(applicantId: string, status: string) {
        // Find the application in the local list
        const application = this.job.applications.find((a: any) => a._id === applicantId);
        if (!application) return;

        // Store old status for rollback
        const oldStatus = application.status;

        // Prevent redundant updates
        if (oldStatus === status) return;

        // INSTANT UI UPDATE (Optimistic)
        application.status = status;

        this.jobService.updateApplicantStatus(this.job._id, applicantId, status).pipe(take(1)).subscribe({
            next: (data) => {
                // Ensure the data from server is fully merged to maintain population
                this.job = data;
            },
            error: (err) => {
                // Revert on error
                application.status = oldStatus;
                const errorMsg = err.error?.msg || err.message || 'Failed to update status';

            }
        });
    }
}
