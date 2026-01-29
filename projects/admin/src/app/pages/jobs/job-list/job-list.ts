import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { ToastService } from '../../../services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-job-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './job-list.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobList implements OnInit, OnDestroy {
    allJobs: any[] = [];
    jobs: any[] = [];
    loading = false;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();

    filters = {
        search: '',
        status: ''
    };

    // Pagination
    Math = Math;
    currentPage = 1;
    pageSize = 10;
    totalItems = 0;
    paginatedJobs: any[] = [];
    totalPages = 0;

    constructor(
        private jobService: JobService,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadJobs();

        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.currentPage = 1; // Reset to first page
            this.applyFilters();
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSearchChange() {
        this.searchSubject.next(this.filters.search);
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
                    this.applyFilters(); // Recalculate filters and pagination
                    this.toastService.success('Job deleted successfully!');
                },
                error: (err) => {
                    const errorMsg = err.error?.msg || err.message || 'Failed to delete job';
                    this.toastService.error(`Error: ${errorMsg}`);
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
        this.totalItems = filtered.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.paginate();
    }

    paginate() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedJobs = this.jobs.slice(startIndex, endIndex);
        this.cdr.markForCheck();
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.paginate();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.paginate();
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.paginate();
        }
    }

    // TrackBy function for performance optimization
    trackByJobId(index: number, job: any): any {
        return job._id;
    }
}
