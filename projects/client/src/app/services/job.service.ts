import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private apiUrl = 'http://localhost:5000/api/jobs';

    // State management
    private jobsSubject = new BehaviorSubject<any[] | null>(null);
    public jobs$ = this.jobsSubject.asObservable();

    private appliedJobsSubject = new BehaviorSubject<any[] | null>(null);
    public appliedJobs$ = this.appliedJobsSubject.asObservable();

    constructor(private http: HttpClient) { }

    getJobs(): Observable<any[]> {
        // Return observable but also fetch and update state
        return this.http.get<any[]>(this.apiUrl).pipe(
            tap(jobs => this.jobsSubject.next(jobs))
        );
    }

    getAppliedJobs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/applied`).pipe(
            tap(jobs => this.appliedJobsSubject.next(jobs))
        );
    }

    getJobById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    applyForJob(id: string, studentId: string): Observable<any> {
        // Optimistic Update
        const currentJobs = this.jobsSubject.value || [];
        const jobIndex = currentJobs.findIndex(j => j._id === id);

        let previousJobs = [...currentJobs]; // Backup if fail

        if (jobIndex !== -1) {
            const updatedJobs = [...currentJobs];
            const updatedJob = { ...updatedJobs[jobIndex] };

            // Update local state immediately
            if (!updatedJob.applications) updatedJob.applications = [];
            updatedJob.applications.push({ student: studentId });
            updatedJobs[jobIndex] = updatedJob;

            this.jobsSubject.next(updatedJobs);
        }

        return this.http.post<any>(`${this.apiUrl}/${id}/apply`, {}).pipe(
            tap((res) => {
                // On success, we can trigger a refetch or keep the optimistic update
                // Since response might contain updated job data, we could merge it
                // For now, optimistic update is sufficient or we update with res.job
            }),
            catchError(err => {
                // Revert on error
                this.jobsSubject.next(previousJobs);
                throw err;
            })
        );
    }

    withdrawApplication(id: string): Observable<any> {
        // Optimistic Update for Applied Jobs List
        const currentApplied = this.appliedJobsSubject.value || [];
        const previousApplied = [...currentApplied];

        const updatedApplied = currentApplied.filter(j => j._id !== id);
        this.appliedJobsSubject.next(updatedApplied);

        // Also need to likely update the main jobs list state if it's loaded
        const currentJobs = this.jobsSubject.value || [];
        const jobIndex = currentJobs.findIndex(j => j._id === id);
        if (jobIndex !== -1) {
            const updatedJobs = [...currentJobs];
            const updatedJob = { ...updatedJobs[jobIndex] };
            // We'd need to remove the student from applications, but we assume we have the ID?
            // Simplest is to just let getJobs refresh eventually, but for strict consistency:
            // We can't easily filter applications without studentId context here, but "hasApplied" logic is in component usually.
            // Best to just rely on component re-checking or refetching main list if needed.
        }

        return this.http.delete<any>(`${this.apiUrl}/${id}/withdraw`).pipe(
            catchError(err => {
                // Revert
                this.appliedJobsSubject.next(previousApplied);
                throw err;
            })
        );
    }
}
