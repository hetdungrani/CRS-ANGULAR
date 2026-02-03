import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../components/shared/toast/toast.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  isRegistrationDisabled: boolean = false;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.checkRegistrationStatus();
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      department: ['', Validators.required],
      cgpa: ['', [Validators.required, Validators.min(0), Validators.max(10), Validators.pattern('^[0-9]+$')]],
      gender: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  checkRegistrationStatus(): void {
    this.loading = true;
    this.authService.getSettings().pipe(take(1)).subscribe({
      next: (settings) => {
        if (settings && !settings.allowRegistration) {
          this.isRegistrationDisabled = true;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) return null;
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = { ...this.registerForm.value };

      // Normalize department
      if (formValue.department) {
        formValue.department = formValue.department.trim();
        // Simple normalization: uppercase if 4 chars or less (e.g. CSE, IT), otherwise title case
        if (formValue.department.length <= 4) {
          formValue.department = formValue.department.toUpperCase();
        }
      }

      this.authService.register(formValue).subscribe({
        next: (res) => {
          this.toastService.success('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.status === 403) {
            this.errorMessage = 'Registration is not allowed';
          } else {
            this.errorMessage = err.error?.msg || 'Registration failed. Please try again.';
          }
          this.toastService.error(this.errorMessage);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
