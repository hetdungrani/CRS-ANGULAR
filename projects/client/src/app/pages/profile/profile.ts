import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
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
    skills: [] as string[]
  };

  // Temporary data for editing
  editData: any = {};

  constructor(private authService: AuthService, private router: Router) { }

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
    // Fetch data from logged-in user (from localStorage or API)
    this.profileData.fullName = this.user.fullName || '';
    this.profileData.email = this.user.email || '';

    // These fields would typically come from a backend API
    // For now, we'll check if they exist in localStorage or set as empty
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      this.profileData = { ...this.profileData, ...profile };
    }
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
    if (typeof this.editData.skills === 'string') {
      this.editData.skills = this.editData.skills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s !== '');
    }

    // Update profile data
    this.profileData = { ...this.editData };

    // Save to localStorage (in real app, send to backend)
    localStorage.setItem('userProfile', JSON.stringify(this.profileData));

    this.isEditMode = false;
    alert('Profile updated successfully!');
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
