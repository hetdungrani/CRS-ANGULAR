import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { ToastService } from '../../components/shared/toast/toast.service';
import { ModalService } from '../../components/shared/modal/modal.service';

import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css'
})
export class Jobs implements OnInit {
  user: any;
  jobs: any[] = [];
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

      const data = this.route.snapshot.data['jobs'];

      this.jobService.jobs$.subscribe(jobs => {
        if (jobs !== null) {
          this.processJobs(jobs);
        } else if (data) {
          this.processJobs(data);
        }
      });

    } else {
      this.router.navigate(['/login']);
    }
  }

  processJobs(data: any[]): void {
    this.jobs = data.map((job: any) => ({
      ...job,
      hasApplied: this.checkIfApplied(job)
    }));
  }

  checkIfApplied(job: any): boolean {
    if (!this.user || !job.applications) return false;
    return job.applications.some((app: any) => {
      // Handle both populated and unpopulated student references
      const studentId = app.student._id || app.student;
      return studentId === this.user.id || studentId === this.user._id;
    });
  }

  async applyForJob(jobId: string): Promise<void> {
    const confirmed = await this.modalService.confirm(
      'Apply for Job',
      'Are you sure you want to apply for this position?',
      'Apply Now',
      'Cancel',
      'info'
    );

    if (!confirmed) return;

    this.jobService.applyForJob(jobId, this.user._id || this.user.id).subscribe({
      next: (res) => {
        this.toastService.success('Application submitted successfully!');
      },
      error: (err) => {
        const msg = err.error?.msg || 'Application failed';
        this.toastService.error(msg);
      }
    });
  }

  trackByJobId(index: number, job: any): any {
    return job._id;
  }
}
