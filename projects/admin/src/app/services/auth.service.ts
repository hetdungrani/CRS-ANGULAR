import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5000/api/admin';

    constructor(private http: HttpClient) { }

    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials);
    }

    getMe(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/me`);
    }

    setToken(token: string): void {
        localStorage.setItem('admin_token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('admin_token');
    }

    setAdmin(admin: any): void {
        localStorage.setItem('admin_data', JSON.stringify(admin));
    }

    getAdmin(): any {
        const data = localStorage.getItem('admin_data');
        return data ? JSON.parse(data) : null;
    }

    logout(): void {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
