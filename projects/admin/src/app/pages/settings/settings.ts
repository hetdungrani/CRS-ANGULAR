import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html',
})
export class Settings {
    passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    systemConfig = {
        academicYear: '2025-26',
        allowRegistration: true,
        maintenanceMode: false
    };

    loading = false;
    message = '';
    isError = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    updatePassword() {
        if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
            this.showMessage('New passwords do not match', true);
            return;
        }

        this.loading = true;
        this.authService.changePassword({
            currentPassword: this.passwordData.currentPassword,
            newPassword: this.passwordData.newPassword
        }).subscribe({
            next: (res) => {
                this.showMessage('Password updated successfully');
                this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
                this.loading = false;
            },
            error: (err) => {
                this.showMessage(err.error.msg || 'Failed to update password', true);
                this.loading = false;
            }
        });
    }

    saveSystemConfig() {
        this.loading = true;
        // Mock save
        setTimeout(() => {
            this.showMessage('System configuration updated');
            this.loading = false;
        }, 1000);
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.authService.logout();
            this.router.navigate(['/login']);
        }
    }

    private showMessage(msg: string, isError = false) {
        this.message = msg;
        this.isError = isError;
        setTimeout(() => this.message = '', 3000);
    }
}
