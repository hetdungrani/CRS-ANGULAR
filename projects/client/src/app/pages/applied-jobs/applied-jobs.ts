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

      const data = this.route.snapshot.data['appliedJobs'];
      if (data) {
        // Resolver likely loaded data
        this.appliedJobs = data;
      }

      // Subscribe to shared state
      this.jobService.appliedJobs$.subscribe(jobs => {
        if (jobs && jobs.length > 0) {
          this.appliedJobs = jobs;
        } else if (data) {
          // Fallback to resolver data if behavior subject is empty or initial
          // But if it was emptied on purpose, this logic might be flawed.
          // Stick to: if jobs is emitted, use it.
          // However, initially behavior subject is empty.
          if (jobs.length > 0) this.appliedJobs = jobs;
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

    this.jobService.withdrawApplication(jobId).subscribe({
      next: () => {
        this.toastService.success('Application withdrawn successfully');
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
