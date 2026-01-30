import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit, OnDestroy {
  notifications: any[] = [];
  loading = false;
  selectedFilter = 'all';
  private sub: Subscription | null = null;

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // 1. Process data from the route resolver if available
    const resolverData = this.route.snapshot.data['notifications'];
    if (resolverData) {
      this.processRawData(resolverData);
    }

    // 2. Subscribe to the service state for instant updates
    this.sub = this.notificationService.notifications$.subscribe(data => {
      this.processRawData(data);
    });

    // 3. Force a refresh to ensure absolute latest data on page open
    this.notificationService.refreshState();
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  private processRawData(data: any[]): void {
    this.notifications = data.map(n => ({
      ...n,
      isRead: this.getReadStatus(n._id),
      icon: this.getIcon(n.type),
      time: this.formatDate(n.createdAt)
    }));
  }

  get filteredNotifications() {
    if (this.selectedFilter === 'all') return this.notifications;
    if (this.selectedFilter === 'unread') return this.notifications.filter(n => !n.isRead);
    return this.notifications.filter(n => n.type === this.selectedFilter);
  }

  get unreadCount() {
    return this.notifications.filter(n => !n.isRead).length;
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  markAsRead(id: string) {
    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem('readNotifications', JSON.stringify(readIds));
      // Trigger a re-process of local state
      this.processRawData(this.notifications);
    }
  }

  markAllAsRead() {
    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    this.notifications.forEach(n => {
      if (!readIds.includes(n._id)) readIds.push(n._id);
    });
    localStorage.setItem('readNotifications', JSON.stringify(readIds));
    this.processRawData(this.notifications);
  }

  private getReadStatus(id: string): boolean {
    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    return readIds.includes(id);
  }

  private getIcon(type: string): string {
    const icons: any = { job: '💼', interview: '🎯', exam: '📅', result: '🎉' };
    return icons[type] || '🔔';
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  trackById(index: number, item: any) {
    return item._id;
  }
}
