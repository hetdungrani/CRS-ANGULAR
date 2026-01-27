import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css'
})
export class Statistics implements OnInit {
  user: any;

  // Statistics data
  stats = {
    totalApplied: 0,
    shortlisted: 0,
    selected: 0,
    rejected: 0,
    pending: 0,
    internships: 0,
    fullTime: 0
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.calculateStats();
    } else {
      this.router.navigate(['/login']);
    }
  }

  calculateStats(): void {
    const data = this.route.snapshot.data['stats'];
    if (data) {
      const { allJobs, appliedJobs } = data;
      this.stats.totalApplied = appliedJobs.length || 0;
      this.stats.shortlisted = appliedJobs.filter((a: any) => a.status === 'shortlisted').length;
      this.stats.selected = appliedJobs.filter((a: any) => a.status === 'selected').length;
      this.stats.rejected = appliedJobs.filter((a: any) => a.status === 'rejected').length;
      this.stats.pending = appliedJobs.filter((a: any) => a.status === 'applied').length;

      // Calculate based on job types if available (assuming role or package implies type for now)
      // In a real app, 'type' field would be in Job model
      this.stats.fullTime = allJobs.length;
      this.stats.internships = Math.floor(allJobs.length / 3); // Sample logic
    }
  }

  getPercentage(value: number): number {
    if (this.stats.totalApplied === 0) return 0;
    return (value / this.stats.totalApplied) * 100;
  }

  getStatusData() {
    return [
      { label: 'Shortlisted', value: this.stats.shortlisted, color: 'bg-yellow-500', percentage: this.getPercentage(this.stats.shortlisted) },
      { label: 'Selected', value: this.stats.selected, color: 'bg-green-500', percentage: this.getPercentage(this.stats.selected) },
      { label: 'Rejected', value: this.stats.rejected, color: 'bg-red-500', percentage: this.getPercentage(this.stats.rejected) },
      { label: 'Pending', value: this.stats.pending, color: 'bg-blue-500', percentage: this.getPercentage(this.stats.pending) }
    ];
  }
}
