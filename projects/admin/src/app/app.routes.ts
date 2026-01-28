import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { StudentList } from './pages/students/student-list/student-list';
import { StudentDetail } from './pages/students/student-detail/student-detail';
import { JobList } from './pages/jobs/job-list/job-list';
import { JobForm } from './pages/jobs/job-form/job-form';
import { JobDetail } from './pages/jobs/job-detail/job-detail';
import { Applications } from './pages/applications/applications';
import { Notifications } from './pages/notifications/notifications';
import { Settings } from './pages/settings/settings';
import {
    dashboardResolver,
    jobListResolver,
    jobDetailResolver,
    studentListResolver,
    studentDetailResolver,
    applicationsResolver,
    notificationsResolver
} from './resolvers/admin.resolver';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: Login },
    {
        path: '',
        component: AdminLayout,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: Dashboard,
                resolve: { data: dashboardResolver }
            },
            {
                path: 'students',
                component: StudentList,
                resolve: { students: studentListResolver }
            },
            {
                path: 'students/:id',
                component: StudentDetail,
                resolve: { student: studentDetailResolver }
            },
            {
                path: 'jobs',
                component: JobList,
                resolve: { jobs: jobListResolver }
            },
            {
                path: 'jobs/add',
                component: JobForm
            },
            {
                path: 'jobs/edit/:id',
                component: JobForm,
                resolve: { job: jobDetailResolver }
            },
            {
                path: 'jobs/:id',
                component: JobDetail,
                resolve: { job: jobDetailResolver }
            },
            {
                path: 'applications',
                component: Applications,
                resolve: { applications: applicationsResolver }
            },
            {
                path: 'notifications',
                component: Notifications,
                resolve: { notifications: notificationsResolver }
            },
            {
                path: 'settings',
                component: Settings
            },
        ]
    }
];
