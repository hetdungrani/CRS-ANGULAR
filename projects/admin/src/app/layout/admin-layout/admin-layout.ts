import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { filter, take } from 'rxjs/operators';
import { ToastService } from '../../components/shared/toast/toast.service';
import { ModalService } from '../../components/shared/modal/modal.service';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './admin-layout.html',
})
export class AdminLayout implements OnInit {
    admin: any;
    currentTitle = 'Dashboard';

    constructor(
        private authService: AuthService,
        private themeService: ThemeService,
        private router: Router,
        private toastService: ToastService,
        private modalService: ModalService
    ) { }

    ngOnInit() {
        this.admin = this.authService.getAdmin();
        this.updateTitle(this.router.url);
        this.loadSystemTheme();

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.updateTitle(event.urlAfterRedirects);
        });
    }

    private loadSystemTheme() {
        this.authService.getSettings().pipe(take(1)).subscribe({
            next: (settings) => {
                if (settings && settings.theme) {
                    this.themeService.setTheme(settings.theme);
                }
            },
            error: (err) => {
                // console.error('Failed to load system theme', err);
            }
        });
    }

    private updateTitle(url: string) {
        const path = url.split('/')[1] || 'dashboard';
        const titles: { [key: string]: string } = {
            'dashboard': 'Dashboard Overview',
            'students': 'Student Management',
            'jobs': 'Job & Placement Drives',
            'applications': 'Application Tracking',
            'notifications': 'System Notifications',
            'settings': 'Admin Settings'
        };
        this.currentTitle = titles[path] || 'Dashboard';
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
            this.themeService.setTheme('light');
            this.router.navigate(['/login']);
            this.toastService.success('Logged out successfully');
        }
    }
}
