import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ToastService } from '../../services/toast.service';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
    selector: 'app-job-details',
    standalone: true,
    imports: [CommonModule, RouterModule, Header, Footer],
    templateUrl: './job-details.html',
    styleUrl: './job-details.css'
})
export class JobDetails implements OnInit {
    job: any = null;
    loading = true;
    error = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private jobService: JobService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        // Data resolved from route
        this.route.data.subscribe(data => {
            if (data['job']) {
                this.job = data['job'];
                this.loading = false;
            } else {
                this.error = 'Job not found';
                this.loading = false;
            }
        });
    }

    goBack(): void {
        // Navigate back to applied jobs (user likely came from there)
        this.router.navigate(['/applied-jobs']);
    }
}
