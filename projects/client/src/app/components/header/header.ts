import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  @Input() activeRoute: string = '';

  user: any;
  unreadCount: number = 0;
  isProfileOpen = false;
  isMobileMenuOpen = false;
  private sub: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) this.user = JSON.parse(userStr);

    // Subscribe to shared notifications state to keep the counter updated instantly
    this.sub = this.notificationService.notifications$.subscribe(data => {
      const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      this.unreadCount = data.filter(n => !readIds.includes(n._id)).length;
    });

    // Ensure we have data on load
    this.notificationService.refreshState();
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
