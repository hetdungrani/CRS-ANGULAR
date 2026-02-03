import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private apiUrl = `${environment.apiUrl}/admin/jobs`;

    constructor(private http: HttpClient) { }

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
        return this.http.get<any[]>(url);
    }

    getJobById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createJob(jobData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, jobData);
    }

    updateJob(id: string, jobData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, jobData);
    }

    deleteJob(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    updateApplicantStatus(jobId: string, applicantId: string, status: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${jobId}/applicants/${applicantId}`, { status });
    }

    getAllApplications(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/applications/all`);
    }
}
