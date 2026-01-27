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

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.admin = this.authService.getAdmin();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
