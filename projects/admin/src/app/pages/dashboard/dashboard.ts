import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
    admin: any;
    stats = {
        students: 0,
        companies: 0,
        drives: 0,
        closedJobs: 0
    };

    activities: any[] = [];
    activeJobs: any[] = [];
    closedJobs: any[] = [];
    jobs: any[] = [];
    students: any[] = [];
    notifications: any[] = [];

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.admin = this.authService.getAdmin();
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        const data = this.route.snapshot.data['data'];
        if (data) {
            this.jobs = data.jobs || [];
            this.students = data.students || [];
            this.notifications = data.notifications || [];

            // Calculate real stats
            this.stats.students = this.students.length;
            this.stats.drives = this.jobs.filter((j: any) => j.status === 'open').length;
            this.stats.closedJobs = this.jobs.filter((j: any) => j.status === 'closed').length;

            // Sort jobs by creation date (latest first)
            // Using _id fallback since MongoDB _id usually encodes timestamp
            const sortedJobs = [...this.jobs].sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 
                              (a._id ? parseInt(a._id.substring(0, 8), 16) : 0);
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 
                              (b._id ? parseInt(b._id.substring(0, 8), 16) : 0);
                return dateB - dateA;
            });

            // Get only the latest 4 for dashboard tables
            this.activeJobs = sortedJobs.filter(j => j.status === 'open').slice(0, 4);
            this.closedJobs = sortedJobs.filter(j => j.status === 'closed').slice(0, 4);

            // Calculate total unique applications across all jobs
            const totalApps = this.jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
            this.stats.companies = totalApps; // Reusing companies field for Total Applications

            // Convert notifications to activities
            this.activities = this.notifications.slice(0, 5).map((n: any) => ({
                title: n.title,
                desc: n.message,
                time: this.getTimeAgo(n.createdAt),
                type: n.type || 'general'
            }));
        }
    }

    getTimeAgo(date: string): string {
        const now = new Date();
        const created = new Date(date);
        const diffMs = now.getTime() - created.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `${diffMins} mins ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
