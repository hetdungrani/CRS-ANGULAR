import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private apiUrl = `${environment.apiUrl}/jobs`;

    // Central state for all jobs to ensure instant UI updates across components
    private jobsSubject = new BehaviorSubject<any[]>([]);
    public jobs$ = this.jobsSubject.asObservable();

    private appliedJobsSubject = new BehaviorSubject<any[]>([]);
    public appliedJobs$ = this.appliedJobsSubject.asObservable();

    constructor(private http: HttpClient) { }

    /**
     * Fetches all jobs and updates state
     */
    getJobs(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            tap(jobs => this.jobsSubject.next(jobs))
        );
    }

    /**
     * Fetches jobs user has applied for
     */
    getAppliedJobs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/applied`).pipe(
            tap(jobs => this.appliedJobsSubject.next(jobs))
        );
    }

    /**
     * Fetches details of a single job
     */
    getJobById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    /**
     * Optimized application with instant UI update
     */
    applyForJob(jobId: string, studentId: string): Observable<any> {
        const currentJobs = this.jobsSubject.value;
        const previousJobs = [...currentJobs];

        // Optimistic Update: Update local state before server responds
        const updatedJobs = currentJobs.map(job => {
            if (job._id === jobId) {
                return {
                    ...job,
                    applications: [...(job.applications || []), { student: studentId }]
                };
            }
            return job;
        });
        this.jobsSubject.next(updatedJobs);

        return this.http.post(`${this.apiUrl}/${jobId}/apply`, {}).pipe(
            catchError(err => {
                // Revert UI if server fails
                this.jobsSubject.next(previousJobs);
                throw err;
            })
        );
    }

    /**
     * Optimized withdrawal with instant UI update
     */
    withdrawApplication(jobId: string): Observable<any> {
        const currentApplied = this.appliedJobsSubject.value;
        const previousApplied = [...currentApplied];

        // Optimistic Update
        this.appliedJobsSubject.next(currentApplied.filter(j => j._id !== jobId));

        return this.http.delete(`${this.apiUrl}/${jobId}/withdraw`).pipe(
            catchError(err => {
                this.appliedJobsSubject.next(previousApplied);
                throw err;
            })
        );
    }
}
