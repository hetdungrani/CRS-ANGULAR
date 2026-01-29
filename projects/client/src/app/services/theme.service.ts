import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
    public theme$ = this.themeSubject.asObservable();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
            if (savedTheme) {
                this.setTheme(savedTheme);
            }
        }
    }

    setTheme(theme: 'light' | 'dark') {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('theme', theme);
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
        this.themeSubject.next(theme);
    }

    getTheme(): 'light' | 'dark' {
        return this.themeSubject.value;
    }
}
