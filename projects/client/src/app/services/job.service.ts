import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private apiUrl = 'http://localhost:5000/api/jobs';

    constructor(private http: HttpClient) { }

    getJobs(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getAppliedJobs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/applied`);
    }

    getJobById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    applyForJob(id: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/apply`, {});
    }
}
