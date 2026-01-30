import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:5000/api/notifications';

    // Single source of truth for notifications across the app
    private notificationsSubject = new BehaviorSubject<any[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();

    private pollInterval: any;

    constructor(private http: HttpClient) {
        this.init();
    }

    private init() {
        this.refreshState();
        // Background polling every 30 seconds for instant UI updates
        this.pollInterval = setInterval(() => this.refreshState(), 30000);
    }

    /**
     * Fetches latest notifications and updates the shared state
     */
    public refreshState(): void {
        const token = localStorage.getItem('token');
        if (!token) return;

        this.http.get<any[]>(`${this.apiUrl}/my`).subscribe({
            next: (data) => this.notificationsSubject.next(data),
            error: () => console.warn('Notification poll failed')
        });
    }

    /**
     * Returns the current notifications list once (Observable)
     */
    getMyNotifications(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/my`).pipe(
            tap(data => this.notificationsSubject.next(data))
        );
    }

    /**
     * Cleanup polling when service is destroyed (unlikely for root service)
     */
    stopPolling() {
        if (this.pollInterval) clearInterval(this.pollInterval);
    }

    clearState() {
        this.notificationsSubject.next([]);
    }
}
