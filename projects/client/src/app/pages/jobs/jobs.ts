import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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

  // Dummy job data
  jobs = [
    {
      id: 1,
      companyName: 'Google',
      jobTitle: 'Software Development Engineer',
      location: 'Bangalore',
      jobType: 'Full-Time',
      package: '18-22 LPA',
      minCGPA: 7.5,
      eligibleBranches: ['CS', 'IT'],
      hasApplied: false
    },
    {
      id: 2,
      companyName: 'Microsoft',
      jobTitle: 'Software Engineer Intern',
      location: 'Hyderabad',
      jobType: 'Internship',
      package: '₹50,000/month',
      minCGPA: 7.0,
      eligibleBranches: ['CS', 'IT', 'ECE'],
      hasApplied: true
    },
    {
      id: 3,
      companyName: 'Amazon',
      jobTitle: 'SDE-1',
      location: 'Remote',
      jobType: 'Full-Time',
      package: '15-20 LPA',
      minCGPA: 7.0,
      eligibleBranches: ['CS', 'IT'],
      hasApplied: false
    }
  ];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    } else {
      this.router.navigate(['/login']);
    }
  }

  applyForJob(jobId: number): void {
    console.log('Apply for job:', jobId);
    // Apply logic here
  }
}
