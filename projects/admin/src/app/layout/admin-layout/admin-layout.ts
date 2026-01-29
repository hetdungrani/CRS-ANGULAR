import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './admin-layout.html',
})
export class AdminLayout implements OnInit {
    admin: any;
    currentTitle = 'Dashboard';

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.admin = this.authService.getAdmin();
        this.updateTitle(this.router.url);

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.updateTitle(event.urlAfterRedirects);
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

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
