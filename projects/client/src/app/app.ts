import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.authService.getSettings().subscribe({
      next: (settings) => {
        if (settings && settings.theme) {
          this.themeService.setTheme(settings.theme);
        }
      },
      error: (err) => {
        console.error('Failed to load settings:', err);
      }
    });
  }
}
