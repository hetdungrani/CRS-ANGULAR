import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';

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
        private route: ActivatedRoute
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
                console.error('Error fetching job:', err);
                this.loading = false;
            }
        });
    }

    updateStatus(applicantId: string, status: string) {
        this.updatingStatus = applicantId;
        this.jobService.updateApplicantStatus(this.job._id, applicantId, status).subscribe({
            next: (data) => {
                this.job = data;
                this.updatingStatus = null;
            },
            error: (err) => {
                console.error('Error updating status:', err);
                this.updatingStatus = null;
            }
        });
    }
}
