import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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

  // Dummy applied jobs data
  appliedJobs = [
    {
      id: 1,
      companyName: 'Google',
      jobRole: 'Software Development Engineer',
      jobType: 'Full-Time',
      status: 'Shortlisted'
    },
    {
      id: 2,
      companyName: 'Microsoft',
      jobRole: 'Software Engineer Intern',
      jobType: 'Internship',
      status: 'Interview Scheduled'
    },
    {
      id: 3,
      companyName: 'Amazon',
      jobRole: 'SDE-1',
      jobType: 'Full-Time',
      status: 'Applied'
    },
    {
      id: 4,
      companyName: 'Infosys',
      jobRole: 'System Engineer',
      jobType: 'Full-Time',
      status: 'Selected'
    },
    {
      id: 5,
      companyName: 'TCS',
      jobRole: 'Digital Trainee',
      jobType: 'Full-Time',
      status: 'Rejected'
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

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Applied': 'bg-blue-100 text-blue-800',
      'Shortlisted': 'bg-yellow-100 text-yellow-800',
      'Interview Scheduled': 'bg-purple-100 text-purple-800',
      'Selected': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  viewDetails(jobId: number): void {
    console.log('View details for application:', jobId);
    // Navigate to application details page
  }
}
