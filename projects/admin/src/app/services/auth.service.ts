import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/admin`;

    constructor(private http: HttpClient) { }

    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials);
    }

    getMe(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/me`);
    }

    setToken(token: string): void {
        sessionStorage.setItem('admin_token', token);
    }

    getToken(): string | null {
        return sessionStorage.getItem('admin_token');
    }

    setAdmin(admin: any): void {
        sessionStorage.setItem('admin_data', JSON.stringify(admin));
    }

    getAdmin(): any {
        const data = sessionStorage.getItem('admin_data');
        return data ? JSON.parse(data) : null;
    }

    logout(): void {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_data');
    }

    changePassword(data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/change-password`, data);
    }

    getSettings(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/settings`);
    }

    getPublicSettings(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/settings`);
    }

    updateSettings(data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/settings`, data);
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        return !!token && token !== 'null' && token !== 'undefined';
    }
}
