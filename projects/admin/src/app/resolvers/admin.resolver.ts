import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { JobService } from '../services/job.service';
import { StudentService } from '../services/student.service';
import { NotificationService } from '../services/notification.service';
import { forkJoin } from 'rxjs';

// Dashboard Resolver - Fetch all dashboard data in parallel
export const dashboardResolver: ResolveFn<any> = (route, state) => {
    const jobService = inject(JobService);
    const studentService = inject(StudentService);
    const notificationService = inject(NotificationService);

    return forkJoin({
        jobs: jobService.getJobs(),
        students: studentService.getAllStudents(),
        notifications: notificationService.getNotifications()
    });
};

// Job List Resolver
export const jobListResolver: ResolveFn<any> = (route, state) => {
    return inject(JobService).getJobs();
};

// Job Detail Resolver
export const jobDetailResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state) => {
    const jobId = route.paramMap.get('id');
    if (!jobId) return null;
    return inject(JobService).getJobById(jobId);
};

// Student List Resolver
export const studentListResolver: ResolveFn<any> = (route, state) => {
    return inject(StudentService).getAllStudents();
};

// Student Detail Resolver
export const studentDetailResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state) => {
    const studentId = route.paramMap.get('id');
    if (!studentId) return null;
    return inject(StudentService).getStudentById(studentId);
};

// Applications Resolver
export const applicationsResolver: ResolveFn<any> = (route, state) => {
    return inject(JobService).getAllApplications();
};

// Notifications Resolver
export const notificationsResolver: ResolveFn<any> = (route, state) => {
    return inject(NotificationService).getNotifications();
};
