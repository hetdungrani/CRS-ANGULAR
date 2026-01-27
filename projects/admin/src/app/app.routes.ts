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

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: Login },
    {
        path: '',
        component: AdminLayout,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'students', component: StudentList },
            { path: 'students/:id', component: StudentDetail },
            { path: 'jobs', component: JobList },
            { path: 'jobs/add', component: JobForm },
            { path: 'jobs/edit/:id', component: JobForm },
            { path: 'jobs/:id', component: JobDetail },
            { path: 'applications', component: Applications },
            { path: 'notifications', component: Notifications },
            { path: 'settings', component: Settings },

        ]
    }
];
