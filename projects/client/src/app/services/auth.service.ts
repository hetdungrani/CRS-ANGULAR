import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5000/api/auth';

    constructor(private http: HttpClient) { }

    register(userFn: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, userFn);
    }

    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials);
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
    }

    setUser(user: any): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getMe(): Observable<any> {
        const token = this.getToken();
        return this.http.get<any>(`${this.apiUrl}/me`, {
            headers: { 'x-auth-token': token || '' }
        });
    }

    updateProfile(data: any): Observable<any> {
        const token = this.getToken();
        return this.http.put<any>(`${this.apiUrl}/profile`, data, {
            headers: { 'x-auth-token': token || '' }
        });
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        return !!token;
    }
}

