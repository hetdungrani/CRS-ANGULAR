import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
    admin: any;
    stats = {
        students: 250,
        companies: 12,
        drives: 5,
        placed: 85
    };

    activities = [
        { title: 'New Student Registration', desc: 'Ravi Kumar (CS) registered', time: '10 mins ago', type: 'student' },
        { title: 'New Job Drive', desc: 'Infosys announced a recruitment drive', time: '2 hours ago', type: 'job' },
        { title: 'Company Added', desc: 'Wipro Technologies has been onboarded', time: '5 hours ago', type: 'company' },
        { title: 'Student Placed', desc: 'Anjali Singh placed in TCS', time: '1 day ago', type: 'success' }
    ];

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.admin = this.authService.getAdmin();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
