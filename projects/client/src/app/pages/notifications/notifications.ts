import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { NotificationService } from '../../services/notification.service';

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
  allNotifications: any[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.loadNotifications();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadNotifications(): void {
    const data = this.route.snapshot.data['notifications'];
    if (data) {
      this.allNotifications = data.map((n: any) => ({
        ...n,
        isRead: false,
        icon: this.getIconForType(n.type),
        timestamp: this.formatTime(n.createdAt)
      }));
    }
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

  trackByNotificationId(index: number, notification: any): any {
    return notification._id || notification.id;
  }
}
