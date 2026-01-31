import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { ThemeService } from '../../services/theme.service';
import { take } from 'rxjs';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html',
})
export class Settings implements OnInit {
    passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    systemConfig = {
        allowRegistration: true,
        theme: 'light' as 'light' | 'dark'
    };

    loading = false;

    constructor(
        private authService: AuthService,

        private themeService: ThemeService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadSettings();
    }

    loadSettings() {
        this.loading = true;
        this.authService.getSettings().pipe(take(1)).subscribe({
            next: (data) => {
                this.systemConfig = data;
                this.themeService.setTheme(this.systemConfig.theme);
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error('Failed to load settings:', err);
                this.loading = false;
                this.cdr.markForCheck();
            }
        });
    }

    updatePassword() {
        if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {

            return;
        }

        if (this.passwordData.newPassword.length < 6) {

            return;
        }

        this.loading = true;
        this.cdr.markForCheck();

        // Safety timeout
        const safetyTimer = setTimeout(() => {
            if (this.loading) {
                this.loading = false;

                this.cdr.markForCheck();
            }
        }, 10000);

        this.authService.changePassword({
            currentPassword: this.passwordData.currentPassword,
            newPassword: this.passwordData.newPassword
        }).pipe(take(1)).subscribe({
            next: (res) => {
                clearTimeout(safetyTimer);

                this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                clearTimeout(safetyTimer);
                const errorMsg = err.error?.msg || err.message || 'Failed to update password';

                this.loading = false;
                this.cdr.markForCheck();
            }
        });
    }

    saveSystemConfig() {
        this.loading = true;
        this.cdr.markForCheck();

        this.authService.updateSettings(this.systemConfig).pipe(take(1)).subscribe({
            next: (data) => {

                this.systemConfig = data;
                this.themeService.setTheme(this.systemConfig.theme);
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                const errorMsg = err.error?.msg || err.message || 'Failed to update configuration';

                this.loading = false;
                this.cdr.markForCheck();
            }
        });
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.authService.logout();
            this.themeService.setTheme('light');
            this.router.navigate(['/login']);
        }
    }
}
