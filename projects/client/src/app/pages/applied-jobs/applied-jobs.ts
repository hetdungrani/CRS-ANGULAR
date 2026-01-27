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

  // Modal state
  selectedJob: any = null;
  showModal = false;
  detailsLoading = false;

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
      const data = this.route.snapshot.data['appliedJobs'];
      if (data) {
        this.appliedJobs = data;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  fetchAppliedJobs(): void {
    this.jobService.getAppliedJobs().subscribe({
      next: (data) => {
        this.appliedJobs = data;
      },
      error: (err) => {
        console.error('Error fetching applied jobs:', err);
        this.error = 'Failed to load applied jobs.';
      }
    });
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    const statusClasses: { [key: string]: string } = {
      'applied': 'bg-blue-100 text-blue-700 font-bold',
      'shortlisted': 'bg-yellow-100 text-yellow-700 font-bold',
      'interview scheduled': 'bg-purple-100 text-purple-700 font-bold',
      'selected': 'bg-green-100 text-green-700 font-bold',
      'rejected': 'bg-red-100 text-red-700 font-bold'
    };
    return statusClasses[s] || 'bg-slate-100 text-slate-700 font-bold';
  }

  viewDetails(jobId: string): void {
    console.log('Fetching details for job ID:', jobId);
    this.showModal = true;
    this.detailsLoading = true;

    this.jobService.getJobById(jobId).subscribe({
      next: (job) => {
        this.selectedJob = job;
        this.detailsLoading = false;
      },
      error: (err) => {
        console.error('Error fetching job details:', err);
        alert('Failed to load job details.');
        this.showModal = false;
        this.detailsLoading = false;
      }
    });
  }

  closeDetails(): void {
    this.showModal = false;
    setTimeout(() => {
      this.selectedJob = null;
    }, 300);
  }
}
