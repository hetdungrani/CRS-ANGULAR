import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { JobService } from '../services/job.service';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { forkJoin } from 'rxjs';

export const jobsResolver: ResolveFn<any> = (route, state) => {
    return inject(JobService).getJobs();
};

export const appliedJobsResolver: ResolveFn<any> = (route, state) => {
    return inject(JobService).getAppliedJobs();
};

export const notificationsResolver: ResolveFn<any> = (route, state) => {
    return inject(NotificationService).getMyNotifications();
};

export const profileResolver: ResolveFn<any> = (route, state) => {
    return inject(AuthService).getMe();
};

export const dashboardResolver: ResolveFn<any> = (route, state) => {
    const jobService = inject(JobService);
    const notificationService = inject(NotificationService);
    return forkJoin({
        allJobs: jobService.getJobs(),
        appliedJobs: jobService.getAppliedJobs(),
        notifications: notificationService.getMyNotifications()
    });
};

export const statisticsResolver: ResolveFn<any> = (route, state) => {
    const jobService = inject(JobService);
    return forkJoin({
        allJobs: jobService.getJobs(),
        appliedJobs: jobService.getAppliedJobs()
    });
};
