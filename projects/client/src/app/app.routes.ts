import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Jobs } from './pages/jobs/jobs';
import { AppliedJobs } from './pages/applied-jobs/applied-jobs';
import { Notifications } from './pages/notifications/notifications';
import { Statistics } from './pages/statistics/statistics';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'dashboard', component: Dashboard },
    { path: 'jobs', component: Jobs },
    { path: 'applied-jobs', component: AppliedJobs },
    { path: 'notifications', component: Notifications },
    { path: 'statistics', component: Statistics },
    { path: 'profile', component: Profile }
];
