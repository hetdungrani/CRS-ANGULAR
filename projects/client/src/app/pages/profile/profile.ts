import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

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
    enrollmentNumber: '',
    branch: '',
    year: '',
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
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      // Populate profile data from logged-in user
      this.loadUserProfile();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUserProfile(): void {
    if (!this.user) return;

    // Populate profile data directly from the user data stored during login/registration
    this.profileData = {
      fullName: this.user.fullName || '',
      email: this.user.email || '',
      phone: this.user.mobile || '',
      branch: this.user.department || '',
      year: this.user.year || (this.user.passingYear ? `${this.user.passingYear}` : ''),
      cgpa: this.user.cgpa !== undefined ? `${this.user.cgpa}` : '',
      enrollmentNumber: this.user.enrollmentNumber || '',
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
      enrollmentNumber: 'Enrollment Number',
      branch: 'Branch',
      year: 'Year',
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
    // Process skills if it's a string
    let processedSkills = this.editData.skills;
    if (typeof processedSkills === 'string') {
      processedSkills = processedSkills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s !== '');
    }

    // Map frontend fields to backend fields
    const updateData = {
      fullName: this.editData.fullName,
      email: this.editData.email,
      mobile: this.editData.phone,
      department: this.editData.branch,
      year: this.editData.year,
      cgpa: parseFloat(this.editData.cgpa),
      course: this.editData.course,
      gender: this.editData.gender,
      enrollmentNumber: this.editData.enrollmentNumber,
      dateOfBirth: this.editData.dateOfBirth,
      address: this.editData.address,
      skills: processedSkills
    };

    this.authService.updateProfile(updateData).subscribe({
      next: (updatedUser) => {
        // Update profile data in view
        this.profileData = { ...this.editData, skills: processedSkills };

        // Update user in localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const newUser = { ...user, ...updatedUser };
        this.authService.setUser(newUser);
        this.user = newUser;

        this.isEditMode = false;
        this.toastService.success('Profile updated in database successfully!');
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.toastService.error(err.error?.msg || 'Failed to update profile');
      }
    });
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
