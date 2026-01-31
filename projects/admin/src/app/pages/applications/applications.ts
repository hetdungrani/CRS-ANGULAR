import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job.service';

import { Subject, takeUntil, take } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-applications',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './applications.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Applications implements OnInit, OnDestroy {
    allApplications: any[] = [];
    filteredApplications: any[] = [];
    loading = false;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();

    statusCounts = {
        applied: 0,
        shortlisted: 0,
        selected: 0,
        rejected: 0
    };

    filters = {
        search: '',
        status: '',
        department: ''
    };

    departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Electrical', 'Civil'];

    // Pagination
    Math = Math;
    currentPage = 1;
    pageSize = 10;
    totalItems = 0;
    paginatedApplications: any[] = [];
    totalPages = 0;

    constructor(
        private jobService: JobService,
        private route: ActivatedRoute,

        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadApplications();

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

    calculateCounts() {
        this.statusCounts = {
            applied: this.allApplications.filter(a => a.status === 'applied').length,
            shortlisted: this.allApplications.filter(a => a.status === 'shortlisted').length,
            selected: this.allApplications.filter(a => a.status === 'selected').length,
            rejected: this.allApplications.filter(a => a.status === 'rejected').length
        };
    }

    loadApplications() {
        // Use resolved data - no manual API call
        const data = this.route.snapshot.data['applications'];
        if (data) {
            this.allApplications = data;
            this.calculateCounts();
            this.applyFilters();
        }
    }

    applyFilters() {
        this.filteredApplications = this.allApplications.filter(app => {
            const matchesSearch = !this.filters.search ||
                app.student?.fullName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                app.companyName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                app.role.toLowerCase().includes(this.filters.search.toLowerCase());

            const matchesStatus = !this.filters.status || app.status === this.filters.status;
            const matchesDept = !this.filters.department || app.student?.department === this.filters.department;

            return matchesSearch && matchesStatus && matchesDept;
        });

        this.totalItems = this.filteredApplications.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.paginate();
    }

    paginate() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedApplications = this.filteredApplications.slice(startIndex, endIndex);
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

    updateStatus(jobId: string, applicantId: string, status: string) {
        // Find local application
        const app = this.allApplications.find(a => a._id === applicantId);
        if (!app) return;

        // Store old status for rollback
        const oldStatus = app.status;

        // Prevent redundant updates
        if (oldStatus === status) return;

        // INSTANT UI UPDATE (Optimistic)
        app.status = status;
        this.calculateCounts();
        this.applyFilters();
        this.cdr.markForCheck();

        this.jobService.updateApplicantStatus(jobId, applicantId, status).pipe(take(1)).subscribe({
            next: () => {
                // Success - UI already updated optimistically
            },
            error: (err: any) => {
                // Revert on error
                app.status = oldStatus;
                this.calculateCounts();
                this.applyFilters();
                const errorMsg = err.error?.msg || err.message || 'Failed to update application status';

                this.cdr.markForCheck();
            }
        });
    }

    /* exportToCSV() {
        const headers = ['Student Name', 'Department', 'Email', 'CGPA', 'Company', 'Role', 'Status', 'Applied At'];
        const csvContent = this.filteredApplications.map(app => [
            app.student?.fullName,
            app.student?.department,
            app.student?.email,
            app.student?.cgpa,
            app.companyName,
            app.role,
            app.status,
            new Date(app.appliedAt).toLocaleDateString()
        ].join(','));

        const blob = new Blob([[headers.join(','), ...csvContent].join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `applications_export_${new Date().getTime()}.csv`;
        a.click();
    } */

    // TrackBy function for performance optimization
    trackByApplicationId(index: number, app: any): any {
        return app._id;
    }
}
