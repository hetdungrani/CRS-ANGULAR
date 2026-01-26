import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  user: any;

  // Dashboard statistics
  dashboardStats = {
    availableJobs: 25,
    appliedJobs: 15,
    shortlisted: 5,
    unreadNotifications: 3
  };

  // Recent activity
  recentActivities = [
    {
      id: 1,
      type: 'status',
      message: 'Application for Software Engineer at Google moved to Shortlisted',
      time: '2 hours ago',
      icon: '🎯'
    },
    {
      id: 2,
      type: 'new_job',
      message: 'New job posted: SDE-1 at Amazon',
      time: '5 hours ago',
      icon: '💼'
    },
    {
      id: 3,
      type: 'interview',
      message: 'Interview scheduled for Microsoft on Feb 5, 2026',
      time: '1 day ago',
      icon: '📅'
    },
    {
      id: 4,
      type: 'applied',
      message: 'Successfully applied for Data Analyst at Infosys',
      time: '2 days ago',
      icon: '✅'
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

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
