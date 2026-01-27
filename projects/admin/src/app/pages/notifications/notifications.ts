import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

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

    constructor(private notificationService: NotificationService) { }

    ngOnInit() {
        this.loadNotifications();
    }

    loadNotifications() {
        this.loading = true;
        this.notificationService.getNotifications().subscribe({
            next: (data) => {
                this.notifications = data;
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    sendNotification() {
        this.notificationService.sendNotification(this.newNotification).subscribe({
            next: (data) => {
                this.notifications.unshift(data);
                this.showForm = false;
                this.newNotification = { title: '', message: '', type: 'general', targetGroup: 'all' };
            },
            error: (err) => console.error(err)
        });
    }

    deleteNotification(id: string) {
        if (confirm('Are you sure you want to delete this announcement?')) {
            this.notificationService.deleteNotification(id).subscribe({
                next: () => {
                    this.notifications = this.notifications.filter(n => n._id !== id);
                },
                error: (err) => console.error(err)
            });
        }
    }
}
