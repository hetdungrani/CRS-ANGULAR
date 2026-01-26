import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
    totalApplied: 15,
    shortlisted: 5,
    selected: 2,
    rejected: 3,
    pending: 5,
    internships: 6,
    fullTime: 9
  };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getPercentage(value: number): number {
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
