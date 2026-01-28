import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      // Use resolved data - no manual API call
      const data = this.route.snapshot.data['jobs'];
      if (data) {
        this.jobs = data.map((job: any) => ({
          ...job,
          hasApplied: this.checkIfApplied(job)
        }));
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  checkIfApplied(job: any): boolean {
    if (!this.user || !job.applications) return false;
    return job.applications.some((app: any) =>
      (app.student._id || app.student) === this.user._id
    );
  }

  applyForJob(jobId: string): void {
    if (confirm('Are you sure you want to apply for this job?')) {
      console.log('Applying for job ID:', jobId);
      console.log('Current user:', this.user);
      this.jobService.applyForJob(jobId).subscribe({
        next: (res) => {
          console.log('Application successful:', res);
          alert('Applied successfully!');

          // Find and update the specific job
          const jobIndex = this.jobs.findIndex(j => j._id === jobId);
          console.log('Job index found:', jobIndex);
          console.log('Job before update:', jobIndex !== -1 ? this.jobs[jobIndex] : 'NOT FOUND');
          if (jobIndex !== -1) {
            // Create a new job object with updated hasApplied flag
            this.jobs[jobIndex] = {
              ...this.jobs[jobIndex],
              hasApplied: true,
              applications: [
                ...(this.jobs[jobIndex].applications || []),
                {
                  student: this.user._id,
                  appliedAt: new Date(),
                  status: 'applied'
                }
              ]
            };

            // Create a new array reference to trigger change detection
            this.jobs = [...this.jobs];
            console.log('Job after update:', this.jobs[jobIndex]);
            console.log('hasApplied flag:', this.jobs[jobIndex].hasApplied);
          }
        },
        error: (err) => {
          console.error('Error applying for job:', err);
          console.error('Error status:', err.status);
          console.error('Error message:', err.error?.msg);

          const errorMessage = err.error?.msg || err.message || 'Failed to apply for job.';
          alert(`Application failed: ${errorMessage}`);
        }
      });
    }
  }

  // TrackBy function for performance optimization
  trackByJobId(index: number, job: any): any {
    return job._id;
  }
}
