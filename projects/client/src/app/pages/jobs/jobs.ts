import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { ToastService } from '../../services/toast.service';
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
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);

      // Resolve checks
      const data = this.route.snapshot.data['jobs'];
      if (data) {
        // The resolver likely called getJobs(), so service state is updated,
        // OR we can just use the data. 
        // But to support "instant UI updates" from other places, subscribing to service state is better.
      }

      // Subscribe to service state for real-time-like updates within the app session
      this.jobService.jobs$.subscribe(jobs => {
        if (jobs !== null) {
          this.processJobs(jobs);
        } else if (data) {
          // Fallback to resolver data if service state is empty initially
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
      const studentId = app.student._id || app.student;
      return studentId === this.user.id || studentId === this.user._id;
    });
  }

  applyForJob(jobId: string): void {
    if (!confirm('Apply for this job?')) {
      return;
    }

    // Pass User ID for optimistic update
    this.jobService.applyForJob(jobId, this.user._id || this.user.id).subscribe({
      next: (res) => {
        this.toastService.success('Applied successfully!');
        // Service handles state update, subscription updates view automatically
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
