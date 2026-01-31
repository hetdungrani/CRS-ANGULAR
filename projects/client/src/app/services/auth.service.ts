import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    // User state for instant UI updates
    private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    public user$ = this.userSubject.asObservable();

    private cachedUser: any = null;

    constructor(private http: HttpClient) { }

    private getUserFromStorage(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    register(userFn: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, userFn);
    }

    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(res => this.setUser(res.user))
        );
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userProfile');
        this.userSubject.next(null);
        this.cachedUser = null;
    }

    setUser(user: any): void {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        this.cachedUser = user;
    }

    getMe(): Observable<any> {
        // Return cached user if available for instant feel
        if (this.cachedUser) {
            return of(this.cachedUser);
        }
        return this.http.get<any>(`${this.apiUrl}/me`).pipe(
            tap(user => {
                this.cachedUser = user;
                this.userSubject.next(user);
            })
        );
    }

    updateProfile(data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/profile`, data).pipe(
            tap(updatedUser => {
                const currentUser = this.userSubject.value || {};
                this.setUser({ ...currentUser, ...updatedUser });
            })
        );
    }

    getSettings(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/settings`);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}

