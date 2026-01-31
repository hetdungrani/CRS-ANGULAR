import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { ToastService } from '../../components/shared/toast/toast.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Header, Footer],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: any;
  isEditMode = false;

  // Profile data - will be populated from logged-in user
  profileData = {
    fullName: '',
    branch: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    cgpa: '',
    course: '',
    gender: '',
    skills: [] as string[]
  };

  // Temporary data for editing
  editData: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(userStr);

    // Use data from resolver if available - take(1) for auto-cleanup
    this.route.data.pipe(take(1)).subscribe(data => {
      if (data['profile']) {
        this.user = { ...this.user, ...data['profile'] };
        this.authService.setUser(this.user);
      }
      this.loadUserProfile();
    });
  }

  loadUserProfile(): void {
    if (!this.user) return;

    // Populate profile data directly from the user data stored during login/registration
    this.profileData = {
      fullName: this.user.fullName || '',
      email: this.user.email || '',
      phone: this.user.mobile || '',
      branch: this.user.department || '',
      cgpa: this.user.cgpa !== undefined && this.user.cgpa !== null ? `${this.user.cgpa}` : '',
      dateOfBirth: this.user.dateOfBirth || '',
      address: this.user.address || '',
      course: this.user.course || '',
      gender: this.user.gender || '',
      skills: this.user.skills || []
    };
  }

  get profileCompletionPercentage(): number {
    const fields = Object.values(this.profileData);
    const filledFields = fields.filter(field => {
      if (Array.isArray(field)) {
        return field.length > 0;
      }
      return field !== '' && field !== null && field !== undefined;
    }).length;
    return Math.round((filledFields / fields.length) * 100);
  }

  get isProfileComplete(): boolean {
    return this.profileCompletionPercentage === 100;
  }

  get missingFields(): string[] {
    const missing: string[] = [];
    const fieldLabels: { [key: string]: string } = {
      branch: 'Branch',
      phone: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      address: 'Address',
      cgpa: 'CGPA',
      skills: 'Skills'
    };

    Object.entries(this.profileData).forEach(([key, value]) => {
      if (key === 'fullName' || key === 'email') return; // Skip required fields from registration

      if (Array.isArray(value)) {
        if (value.length === 0) missing.push(fieldLabels[key]);
      } else if (!value || value === '') {
        missing.push(fieldLabels[key]);
      }
    });

    return missing;
  }

  enableEditMode(): void {
    this.isEditMode = true;
    // Create a copy of profile data for editing
    this.editData = {
      ...this.profileData,
      skills: Array.isArray(this.profileData.skills) ? this.profileData.skills.join(', ') : ''
    };
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editData = {};
  }

  updateProfile(): void {
    // Validate CGPA if provided
    if (this.editData.cgpa) {
      const cgpaNum = Number(this.editData.cgpa);
      if (!Number.isInteger(cgpaNum) || cgpaNum < 1 || cgpaNum > 10) {
        this.toastService.error('CGPA must be an integer between 1 and 10');
        return;
      }
    }

    // Process skills if it's a string
    let processedSkills = this.editData.skills;
    if (typeof processedSkills === 'string') {
      processedSkills = processedSkills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s !== '');
    }

    // Save old state for potential revert
    const oldProfileData = { ...this.profileData };
    const oldUser = { ...this.user };

    // INSTANT UI UPDATE (Optimistic)
    this.profileData = { ...this.editData, skills: processedSkills };
    this.user = {
      ...this.user,
      ...this.editData,
      mobile: this.editData.phone,
      department: this.editData.branch,
      skills: processedSkills
    };
    this.authService.setUser(this.user);
    this.isEditMode = false;

    // Map frontend fields to backend fields
    const updateData = {
      fullName: this.editData.fullName,
      email: this.editData.email,
      mobile: this.editData.phone,
      department: this.editData.branch,
      cgpa: this.editData.cgpa ? parseFloat(this.editData.cgpa) : 0,
      course: this.editData.course,
      gender: this.editData.gender,
      dateOfBirth: this.editData.dateOfBirth,
      address: this.editData.address,
      skills: processedSkills
    };

    // Async background update
    this.authService.updateProfile(updateData).pipe(take(1)).subscribe({
      next: (updatedUser) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const newUser = { ...user, ...updatedUser };
        this.authService.setUser(newUser);
        this.user = newUser;
        this.toastService.success('Profile updated successfully');
      },
      error: (err) => {
        // Revert on error
        this.profileData = oldProfileData;
        this.user = oldUser;
        this.authService.setUser(oldUser);
        // console.error('Update failed:', err); // Suppressed for clean UX
        this.toastService.error('Failed to update profile');
      }
    });
  }

  trackByFn(index: number, item: any): any {
    return item || index;
  }

  getInitials(): string {
    if (!this.profileData.fullName) return 'U';
    const names = this.profileData.fullName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return this.profileData.fullName.charAt(0);
  }

  getCompletionColor(): string {
    const percentage = this.profileCompletionPercentage;
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  }
}
