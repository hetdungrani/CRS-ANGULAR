import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
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
        theme: 'light'
    };

    loading = false;

    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadSettings();
    }

    applyTheme(theme: string) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    loadSettings() {
        this.loading = true;
        this.authService.getSettings().pipe(take(1)).subscribe({
            next: (data) => {
                this.systemConfig = data;
                this.applyTheme(this.systemConfig.theme);
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
            this.toastService.error('New passwords do not match');
            return;
        }

        if (this.passwordData.newPassword.length < 6) {
            this.toastService.error('New password must be at least 6 characters long');
            return;
        }

        this.loading = true;
        this.cdr.markForCheck();

        // Safety timeout
        const safetyTimer = setTimeout(() => {
            if (this.loading) {
                this.loading = false;
                this.toastService.error('Connection timed out. Please try again.');
                this.cdr.markForCheck();
            }
        }, 10000);

        this.authService.changePassword({
            currentPassword: this.passwordData.currentPassword,
            newPassword: this.passwordData.newPassword
        }).pipe(take(1)).subscribe({
            next: (res) => {
                clearTimeout(safetyTimer);
                this.toastService.success('Password updated successfully');
                this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                clearTimeout(safetyTimer);
                const errorMsg = err.error?.msg || err.message || 'Failed to update password';
                this.toastService.error(errorMsg);
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
                this.toastService.success('System configuration updated');
                this.systemConfig = data;
                this.applyTheme(this.systemConfig.theme);
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                const errorMsg = err.error?.msg || err.message || 'Failed to update configuration';
                this.toastService.error(errorMsg);
                this.loading = false;
                this.cdr.markForCheck();
            }
        });
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.authService.logout();
            this.router.navigate(['/login']);
        }
    }
}
