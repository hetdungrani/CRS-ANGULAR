import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private apiUrl = 'http://localhost:5000/api/admin/jobs';

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const token = localStorage.getItem('admin_token');
        return new HttpHeaders().set('x-auth-token', token || '');
    }

    getJobs(filters?: any): Observable<any[]> {
        let url = this.apiUrl;
        if (filters) {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params.append(key, filters[key]);
                }
            });
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }
        return this.http.get<any[]>(url, { headers: this.getHeaders() });
    }

    getJobById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createJob(jobData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, jobData, { headers: this.getHeaders() });
    }

    updateJob(id: string, jobData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, jobData, { headers: this.getHeaders() });
    }

    deleteJob(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    updateApplicantStatus(jobId: string, applicantId: string, status: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${jobId}/applicants/${applicantId}`, { status }, { headers: this.getHeaders() });
    }

    getAllApplications(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/applications/all`, { headers: this.getHeaders() });
    }
}
