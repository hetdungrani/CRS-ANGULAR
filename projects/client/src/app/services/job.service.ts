import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private apiUrl = 'http://localhost:5000/api/jobs';

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'x-auth-token': token || ''
        });
    }

    getJobs(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    getAppliedJobs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/applied`, { headers: this.getHeaders() });
    }

    getJobById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    applyForJob(id: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/apply`, {}, { headers: this.getHeaders() });
    }
}
