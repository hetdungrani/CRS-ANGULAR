import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:5000/api/admin/notifications';

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const token = localStorage.getItem('admin_token');
        return new HttpHeaders().set('x-auth-token', token || '');
    }

    getNotifications(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    sendNotification(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data, { headers: this.getHeaders() });
    }

    deleteNotification(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
