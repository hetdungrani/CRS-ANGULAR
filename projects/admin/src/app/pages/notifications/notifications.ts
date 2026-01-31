import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

import { take } from 'rxjs';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './notifications.html',
})
export class Notifications implements OnInit {
    notifications: any[] = [];
    loading = false;
    showForm = false;
    submitting = false;

    newNotification = {
        title: '',
        message: '',
        type: 'general',
        targetGroup: 'all'
    };

    types = [
        { id: 'job', label: 'Job Drive' },
        { id: 'interview', label: 'Interview' },
        { id: 'exam', label: 'Exam' },
        { id: 'result', label: 'Result' },
        { id: 'general', label: 'General Announcement' }
    ];

    groups = [
        { id: 'all', label: 'All Students' },
        { id: 'Computer Science', label: 'Computer Science' },
        { id: 'Information Technology', label: 'Information Technology' },
        { id: 'Electronics', label: 'Electronics' },
        { id: 'Mechanical', label: 'Mechanical' },
        { id: 'Electrical', label: 'Electrical' },
        { id: 'Civil', label: 'Civil' }
    ];

    constructor(
        private route: ActivatedRoute,
        private notificationService: NotificationService,

        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        // Use resolved data from route to prevent infinite loading
        const resolvedData = this.route.snapshot.data['notifications'];
        if (resolvedData) {
            this.notifications = resolvedData;
            this.loading = false;
        } else {
            this.loadNotifications();
        }
    }

    loadNotifications() {
        this.loading = true;
        this.cdr.markForCheck();
        this.notificationService.getNotifications().pipe(take(1)).subscribe({
            next: (data) => {
                this.notifications = data;
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.loading = false;
                const errorMsg = err.error?.msg || err.message || 'Failed to load notifications';

                this.cdr.markForCheck();
            }
        });
    }

    sendNotification() {
        if (this.submitting) return;

        const title = this.newNotification.title?.trim();
        const message = this.newNotification.message?.trim();

        if (!title || !message) {

            return;
        }

        this.submitting = true;
        this.cdr.markForCheck();

        // Safety timeout: If request takes more than 10 seconds, reset the state
        const safetyTimer = setTimeout(() => {
            if (this.submitting) {
                this.submitting = false;

                this.cdr.markForCheck();
            }
        }, 10000);

        this.notificationService.sendNotification(this.newNotification).pipe(take(1)).subscribe({
            next: (data) => {
                clearTimeout(safetyTimer);
                this.notifications.unshift(data);
                this.showForm = false;
                this.newNotification = { title: '', message: '', type: 'general', targetGroup: 'all' };

                this.submitting = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                clearTimeout(safetyTimer);
                this.submitting = false;
                const errorMsg = err.error?.msg || err.message || 'Failed to send notification';

                this.cdr.markForCheck();
            }
        });
    }

    deleteNotification(id: string) {
        if (confirm('Are you sure you want to delete this announcement?')) {
            this.notificationService.deleteNotification(id).pipe(take(1)).subscribe({
                next: () => {
                    this.notifications = this.notifications.filter(n => n._id !== id);

                    this.cdr.markForCheck();
                },
                error: (err) => {
                    const errorMsg = err.error?.msg || err.message || 'Failed to delete notification';

                    this.cdr.markForCheck();
                }
            });
        }
    }

    trackByNotificationId(index: number, notification: any): any {
        return notification._id;
    }
}
