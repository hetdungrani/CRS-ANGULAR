import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  user: any;
  notifications: any[] = [];

  dashboardStats = {
    availableJobs: 0,
    appliedJobs: 0,
    shortlisted: 0,
    unreadNotifications: 0
  };

  recentActivities: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.loadDashboardData();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadDashboardData() {
    this.notificationService.getMyNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.dashboardStats.unreadNotifications = data.length; // Simplified for now
        this.recentActivities = data.slice(0, 4).map(n => ({
          id: n._id,
          type: n.type,
          message: n.title + ': ' + n.message.substring(0, 50) + '...',
          time: this.formatTime(n.createdAt),
          icon: this.getIconForType(n.type)
        }));
      }
    });
  }

  getIconForType(type: string): string {
    const icons: { [key: string]: string } = {
      'job': '💼',
      'interview': '🎯',
      'exam': '📅',
      'result': '🎉',
      'general': '📢'
    };
    return icons[type] || '🔔';
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHrs = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHrs < 1) return 'Just now';
    if (diffInHrs < 24) return `${diffInHrs} hours ago`;
    return date.toLocaleDateString();
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
