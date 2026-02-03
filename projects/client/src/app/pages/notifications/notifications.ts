import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Subscription, take } from 'rxjs';

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
  loadingMore = false;
  total = 0;
  selectedFilter = 'all';
  private sub: Subscription | null = null;
  private totalSub: Subscription | null = null;

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // 1. Process data from the route resolver (This ensures we have data IMMEDIATELY on page visit)
    const resolverData = this.route.snapshot.data['notifications'];
    if (resolverData && resolverData.notifications) {
      this.processRawData(resolverData.notifications);
      this.total = resolverData.total;
    }

    // 2. Subscribe to the live service state for real-time broadcasts
    this.sub = this.notificationService.notifications$.subscribe(data => {
      this.processRawData(data);
      this.cdr.markForCheck();
    });

    // 3. Track total count for pagination
    this.totalSub = this.notificationService.total$.subscribe(val => {
      this.total = val;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.totalSub) this.totalSub.unsubscribe();
  }

  loadMore() {
    if (this.loadingMore || !this.canLoadMore) return;
    this.loadingMore = true;
    this.notificationService.loadMore().pipe(take(1)).subscribe({
      next: () => this.loadingMore = false,
      error: () => this.loadingMore = false
    });
  }

  get canLoadMore(): boolean {
    return this.notifications.length < this.total;
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
    this.notificationService.markAsRead(id);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
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
