import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Jobs } from './pages/jobs/jobs';
import { AppliedJobs } from './pages/applied-jobs/applied-jobs';
import { JobDetails } from './pages/job-details/job-details';
import { Notifications } from './pages/notifications/notifications';
import { Statistics } from './pages/statistics/statistics';
import { Profile } from './pages/profile/profile';
import { dashboardResolver, jobsResolver, appliedJobsResolver, notificationsResolver, statisticsResolver, profileResolver, jobDetailResolver } from './resolvers/job.resolver';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
        resolve: { data: dashboardResolver }
    },
    {
        path: 'jobs',
        component: Jobs,
        canActivate: [authGuard],
        resolve: { jobs: jobsResolver },
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'jobs/:id',
        component: JobDetails,
        canActivate: [authGuard],
        resolve: { job: jobDetailResolver }
    },
    {
        path: 'applied-jobs',
        component: AppliedJobs,
        canActivate: [authGuard],
        resolve: { appliedJobs: appliedJobsResolver },
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'notifications',
        component: Notifications,
        canActivate: [authGuard],
        resolve: { notifications: notificationsResolver }
    },
    {
        path: 'statistics',
        component: Statistics,
        canActivate: [authGuard],
        resolve: { stats: statisticsResolver }
    },
    {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard],
        resolve: { profile: profileResolver }
    }
];

