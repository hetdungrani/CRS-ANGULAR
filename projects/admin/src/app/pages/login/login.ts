import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { take } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
    styleUrls: ['./login.css']
})
export class Login implements OnInit {
    credentials = {
        email: '',
        password: ''
    };
    errorMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private themeService: ThemeService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadTheme();
    }

    loadTheme() {
        this.authService.getPublicSettings().pipe(take(1)).subscribe({
            next: (settings) => {
                if (settings && settings.theme) {
                    this.themeService.setTheme(settings.theme);
                }
            }
        });
    }

    login() {
        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login(this.credentials).subscribe({
            next: (res) => {
                this.authService.setToken(res.token);
                this.authService.setAdmin(res.admin);
                this.router.navigate(['/dashboard']);
                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = err.error?.msg || 'Login failed';
                this.isLoading = false;
            }
        });
    }
}
