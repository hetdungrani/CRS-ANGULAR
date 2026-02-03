import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:5000/api/admin/notifications';

    constructor(private http: HttpClient) { }

    getNotifications(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    sendNotification(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }

    deleteNotification(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    getDepartments(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/departments`);
    }
}
