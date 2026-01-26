import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
  user: any;
  selectedFilter: string = 'all';

  // Extended notification data
  allNotifications = [
    {
      id: 1,
      type: 'status_update',
      title: 'Application Status Updated',
      message: 'Your application for Software Engineer at Google has been Shortlisted',
      isRead: false,
      icon: '🎯',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'new_job',
      title: 'New Job Posted',
      message: 'Amazon is hiring for SDE-1 role matching your profile',
      isRead: false,
      icon: '💼',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      type: 'interview',
      title: 'Interview Scheduled',
      message: 'Interview scheduled for Software Engineer Intern at Microsoft on Feb 5, 2026 at 10:00 AM',
      isRead: false,
      icon: '📅',
      timestamp: '1 day ago'
    },
    {
      id: 4,
      type: 'action',
      title: 'Application Submitted',
      message: 'You have successfully applied for Data Analyst at Infosys',
      isRead: true,
      icon: '✅',
      timestamp: '2 days ago'
    },
    {
      id: 5,
      type: 'status_update',
      title: 'Application Rejected',
      message: 'Your application for Backend Developer at TCS was not selected',
      isRead: true,
      icon: '❌',
      timestamp: '3 days ago'
    },
    {
      id: 6,
      type: 'new_job',
      title: 'New Job Posted',
      message: 'Wipro is hiring for System Engineer role matching your profile',
      isRead: true,
      icon: '💼',
      timestamp: '4 days ago'
    },
    {
      id: 7,
      type: 'status_update',
      title: 'Application Selected',
      message: 'Congratulations! You have been selected for Frontend Developer at Accenture',
      isRead: true,
      icon: '🎉',
      timestamp: '1 week ago'
    },
    {
      id: 8,
      type: 'interview',
      title: 'Interview Reminder',
      message: 'Reminder: Interview for Full Stack Developer at Cognizant tomorrow at 2:00 PM',
      isRead: false,
      icon: '⏰',
      timestamp: '1 day ago'
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

  get filteredNotifications() {
    if (this.selectedFilter === 'all') {
      return this.allNotifications;
    } else if (this.selectedFilter === 'unread') {
      return this.allNotifications.filter(n => !n.isRead);
    } else {
      return this.allNotifications.filter(n => n.type === this.selectedFilter);
    }
  }

  get unreadCount(): number {
    return this.allNotifications.filter(n => !n.isRead).length;
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  markAsRead(notificationId: number): void {
    const notification = this.allNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  markAllAsRead(): void {
    this.allNotifications.forEach(n => n.isRead = true);
  }

  deleteNotification(notificationId: number): void {
    const index = this.allNotifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      this.allNotifications.splice(index, 1);
    }
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

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'status_update': 'Status Update',
      'new_job': 'New Job',
      'interview': 'Interview',
      'action': 'Action'
    };
    return labels[type] || 'Notification';
  }
}
