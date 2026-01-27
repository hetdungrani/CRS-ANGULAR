import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';

@Component({
    selector: 'app-applications',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './applications.html',
})
export class Applications implements OnInit {
    allApplications: any[] = [];
    filteredApplications: any[] = [];
    loading = false;

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

    constructor(private jobService: JobService) { }

    ngOnInit() {
        this.loadApplications();
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
        this.loading = true;
        this.jobService.getAllApplications().subscribe({
            next: (data: any[]) => {
                this.allApplications = data;
                this.calculateCounts();
                this.applyFilters();
                this.loading = false;
            },
            error: (err: any) => {
                console.error('Error fetching applications:', err);
                this.loading = false;
            }
        });
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
    }

    updateStatus(jobId: string, applicantId: string, status: string) {
        this.jobService.updateApplicantStatus(jobId, applicantId, status).subscribe({
            next: () => {
                // Update local status
                const app = this.allApplications.find(a => a._id === applicantId);
                if (app) app.status = status;
                this.applyFilters();
            },
            error: (err: any) => console.error('Error updating status:', err)
        });
    }

    exportToCSV() {
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
    }
}
