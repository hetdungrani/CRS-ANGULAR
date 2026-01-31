import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../components/shared/modal/modal.service';
import { ToastService } from '../../components/shared/toast/toast.service';

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
  currentTheme: 'light' | 'dark' = 'light';
  private sub: Subscription | null = null;
  private themeSub: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    public themeService: ThemeService,
    private modalService: ModalService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) this.user = JSON.parse(userStr);

    // Subscribe to shared notifications state to keep the counter updated instantly
    this.sub = this.notificationService.notifications$.subscribe(data => {
      const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      this.unreadCount = data.filter(n => !readIds.includes(n._id)).length;
    });

    // Subscribe to theme changes
    this.themeSub = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Ensure we have data on load
    this.notificationService.refreshState();
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.themeSub) this.themeSub.unsubscribe();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  async logout() {
    const confirmed = await this.modalService.confirm(
      'Logout',
      'Are you sure you want to logout?',
      'Logout',
      'Cancel',
      'info'
    );

    if (confirmed) {
      this.authService.logout();
      this.router.navigate(['/login']);
      this.toastService.success('Logged out successfully');
    }
  }
}
