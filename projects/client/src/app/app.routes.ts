import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Jobs } from './pages/jobs/jobs';
import { AppliedJobs } from './pages/applied-jobs/applied-jobs';
import { Notifications } from './pages/notifications/notifications';
import { Statistics } from './pages/statistics/statistics';
import { Profile } from './pages/profile/profile';
import { dashboardResolver, jobsResolver, appliedJobsResolver, notificationsResolver, statisticsResolver, profileResolver } from './resolvers/job.resolver';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    {
        path: 'dashboard',
        component: Dashboard,
        resolve: { data: dashboardResolver }
    },
    {
        path: 'jobs',
        component: Jobs,
        resolve: { jobs: jobsResolver }
    },
    {
        path: 'applied-jobs',
        component: AppliedJobs,
        resolve: { appliedJobs: appliedJobsResolver }
    },
    {
        path: 'notifications',
        component: Notifications,
        resolve: { notifications: notificationsResolver }
    },
    {
        path: 'statistics',
        component: Statistics,
        resolve: { stats: statisticsResolver }
    },
    {
        path: 'profile',
        component: Profile,
        resolve: { profile: profileResolver }
    }
];
