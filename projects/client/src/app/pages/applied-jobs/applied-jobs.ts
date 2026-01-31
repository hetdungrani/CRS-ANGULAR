import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';

import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';


@Component({
  selector: 'app-applied-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './applied-jobs.html',
  styleUrl: './applied-jobs.css'
})
export class AppliedJobs implements OnInit {
  user: any;
  appliedJobs: any[] = [];
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);

      const data = this.route.snapshot.data['appliedJobs'];
      if (data) {
        // Resolver likely loaded data
      }

      // Subscribe to shared state
      this.jobService.appliedJobs$.subscribe(jobs => {
        if (jobs !== null) {
          this.appliedJobs = jobs;
        } else if (data) {
          this.appliedJobs = data;
        }
      });

    } else {
      this.router.navigate(['/login']);
    }
  }

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    const statusClasses: { [key: string]: string } = {
      'applied': 'bg-blue-100 text-blue-700',
      'shortlisted': 'bg-yellow-100 text-yellow-700',
      'interview scheduled': 'bg-purple-100 text-purple-700',
      'selected': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    return statusClasses[s] || 'bg-slate-100 text-slate-700';
  }

  withdrawApplication(jobId: string): void {
    if (!confirm('Are you sure you want to withdraw your application? This action cannot be undone.')) {
      return;
    }

    this.jobService.withdrawApplication(jobId).subscribe({
      next: () => {

        // Service updates state, view updates automatically
      },
      error: (err) => {
        const msg = err.error?.msg || 'Failed to withdraw application';

      }
    });
  }

  trackByJobId(index: number, job: any): any {
    return job._id;
  }
}
