import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';

@Component({
    selector: 'app-job-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './job-list.html',
})
export class JobList implements OnInit {
    jobs: any[] = [];
    loading = false;
    filters = {
        search: '',
        status: ''
    };

    constructor(private jobService: JobService) { }

    ngOnInit() {
        this.loadJobs();
    }

    loadJobs() {
        this.loading = true;
        this.jobService.getJobs(this.filters).subscribe({
            next: (data) => {
                this.jobs = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching jobs:', err);
                this.loading = false;
            }
        });
    }

    deleteJob(id: string) {
        if (confirm('Are you sure you want to delete this job drive?')) {
            this.jobService.deleteJob(id).subscribe({
                next: () => {
                    this.jobs = this.jobs.filter(job => job._id !== id);
                },
                error: (err) => {
                    console.error('Error deleting job:', err);
                    alert('Failed to delete job');
                }
            });
        }
    }

    applyFilters() {
        this.loadJobs();
    }
}
