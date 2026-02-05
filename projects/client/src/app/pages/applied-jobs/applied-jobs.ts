import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';

import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { ToastService } from '../../components/shared/toast/toast.service';
import { ModalService } from '../../components/shared/modal/modal.service';


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
    private toastService: ToastService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);

      // Initial data from resolver
      const data = this.route.snapshot.data['appliedJobs'];
      if (data) {
        this.appliedJobs = data;
      }

      // Subscribe to shared state for live updates
      this.jobService.appliedJobs$.subscribe(jobs => {
        // Fix: Allow empty arrays to update the view (e.g. after withdrawing last job)
        if (jobs !== null && jobs !== undefined) {
          this.appliedJobs = jobs;
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

  async withdrawApplication(jobId: string): Promise<void> {
    const confirmed = await this.modalService.confirm(
      'Withdraw Application',
      'Are you sure you want to withdraw your application? This action cannot be undone.',
      'Withdraw',
      'Cancel',
      'danger'
    );

    if (!confirmed) return;

    // Optimistic UI update is handled by JobService
    this.jobService.withdrawApplication(jobId).subscribe({
      next: () => {
        this.toastService.success('Application withdrawn successfully');
        // Live Pagination: Reload resolver to ensure data consistency
        this.router.navigate([], {
          relativeTo: this.route,
          onSameUrlNavigation: 'reload'
        });
      },
      error: (err: any) => {
        const msg = err.error?.msg || 'Failed to withdraw application';
        this.toastService.error(msg);
      }
    });
  }

  trackByJobId(index: number, job: any): any {
    return job._id;
  }
}
