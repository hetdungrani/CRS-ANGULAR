import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { JobService } from '../../../services/job.service';

@Component({
    selector: 'app-job-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './job-list.html',
})
export class JobList implements OnInit {
    allJobs: any[] = [];
    jobs: any[] = [];
    loading = false;
    filters = {
        search: '',
        status: ''
    };

    constructor(
        private jobService: JobService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.loadJobs();
    }

    loadJobs() {
        const data = this.route.snapshot.data['jobs'];
        if (data) {
            this.allJobs = data;
            this.applyFilters();
        }
    }

    deleteJob(id: string) {
        if (confirm('Are you sure you want to delete this job drive?')) {
            this.jobService.deleteJob(id).subscribe({
                next: () => {
                    // Remove from both arrays
                    this.allJobs = this.allJobs.filter(job => job._id !== id);
                    this.jobs = this.jobs.filter(job => job._id !== id);
                    alert('Job deleted successfully!');
                },
                error: (err) => {
                    console.error('Error deleting job:', err);
                    alert('Failed to delete job');
                }
            });
        }
    }

    applyFilters() {
        let filtered = [...this.allJobs];

        // Apply search filter
        if (this.filters.search) {
            const searchLower = this.filters.search.toLowerCase();
            filtered = filtered.filter(job =>
                job.companyName?.toLowerCase().includes(searchLower) ||
                job.role?.toLowerCase().includes(searchLower) ||
                job.description?.toLowerCase().includes(searchLower)
            );
        }

        // Apply status filter
        if (this.filters.status) {
            filtered = filtered.filter(job => job.status === this.filters.status);
        }

        this.jobs = filtered;
    }
}
