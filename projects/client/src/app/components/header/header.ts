import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  @Input() activeRoute: string = 'dashboard';

  user: any;
  isProfileDropdownOpen = false;
  isMobileMenuOpen = false;
  isNotificationDropdownOpen = false;

  // Dummy notifications
  notifications = [
    {
      id: 1,
      type: 'status_update',
      title: 'Application Status Updated',
      message: 'Your application for Software Engineer at Google has been Shortlisted',
      isRead: false,
      icon: '🎯'
    },
    {
      id: 2,
      type: 'new_job',
      title: 'New Job Posted',
      message: 'Amazon is hiring for SDE-1 role matching your profile',
      isRead: false,
      icon: '💼'
    },
    {
      id: 3,
      type: 'interview',
      title: 'Interview Scheduled',
      message: 'Interview scheduled for Software Engineer Intern at Microsoft',
      isRead: false,
      icon: '📅'
    },
    {
      id: 4,
      type: 'action',
      title: 'Application Submitted',
      message: 'You have successfully applied for Data Analyst at Infosys',
      isRead: true,
      icon: '✅'
    },
    {
      id: 5,
      type: 'status_update',
      title: 'Application Rejected',
      message: 'Your application for Backend Developer at TCS was not selected',
      isRead: true,
      icon: '❌'
    }
  ];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    if (this.isProfileDropdownOpen) {
      this.isNotificationDropdownOpen = false;
    }
  }

  toggleNotificationDropdown(): void {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    if (this.isNotificationDropdownOpen) {
      this.isProfileDropdownOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
  }

  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      'status_update': 'bg-blue-50 border-blue-200',
      'new_job': 'bg-green-50 border-green-200',
      'interview': 'bg-purple-50 border-purple-200',
      'action': 'bg-gray-50 border-gray-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
