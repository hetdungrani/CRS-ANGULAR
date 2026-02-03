import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = `${environment.apiUrl}/notifications`;

    // Single source of truth for notifications across the app
    private notificationsSubject = new BehaviorSubject<any[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();

    private totalSubject = new BehaviorSubject<number>(0);
    public total$ = this.totalSubject.asObservable();

    private currentPage = 1;
    private pollInterval: any;

    constructor(private http: HttpClient) {
        this.init();
    }

    private init() {
        // High-frequency polling every 5 seconds for near-instant updates WITHOUT WebSockets
        this.pollInterval = setInterval(() => this.refreshFirstPageSync(), 5000);
    }

    /**
     * Resolves the first page of notifications for Router Resolver
     * This blocks the page load until we have data
     */
    public resolveInitialData(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/my?page=1&limit=10`).pipe(
            tap(res => {
                this.notificationsSubject.next(res.notifications);
                this.totalSubject.next(res.total);
                this.currentPage = 1;
            })
        );
    }

    /**
     * Fetches more notifications (Live Pagination)
     */
    public loadMore(): Observable<any> {
        const nextPage = this.currentPage + 1;
        return this.http.get<any>(`${this.apiUrl}/my?page=${nextPage}&limit=10`).pipe(
            tap(res => {
                const current = this.notificationsSubject.value;
                // Merge and remove duplicates if any (in case of new notifications shifting positions)
                const merged = [...current, ...res.notifications];
                const unique = merged.filter((v, i, a) => a.findIndex(t => t._id === v._id) === i);

                this.notificationsSubject.next(unique);
                this.totalSubject.next(res.total);
                this.currentPage = nextPage;
            })
        );
    }

    /**
     * Background refresh of the first page to catch new broadcasts
     */
    private refreshFirstPageSync(): void {
        const token = localStorage.getItem('token');
        if (!token) return;

        this.http.get<any>(`${this.apiUrl}/my?page=1&limit=10`).subscribe({
            next: (res) => {
                const current = this.notificationsSubject.value;
                const incoming = res.notifications;

                // Merge incoming into current list, favoring newer ones at the top
                const merged = [...incoming, ...current];
                const unique = merged.filter((v, i, a) => a.findIndex(t => t._id === v._id) === i);

                // Only Update if count or IDs changed
                if (unique.length !== current.length || JSON.stringify(unique[0]) !== JSON.stringify(current[0])) {
                    this.notificationsSubject.next(unique);
                    this.totalSubject.next(res.total);
                }
            },
            error: () => { }
        });
    }

    /**
     * Refresh the entire state (back to page 1)
     */
    public refreshState(): void {
        this.resolveInitialData().subscribe();
    }

    /**
     * Returns the current synchronous value of notifications
     */
    public getLatestValue(): any[] {
        return this.notificationsSubject.value;
    }

    /**
     * Internal method to trigger a re-emission of the current state
     * Useful when localStorage (read status) changes
     */
    public triggerLocalUpdate(): void {
        this.notificationsSubject.next([...this.notificationsSubject.value]);
    }

    /**
     * Marks a notification as read locally and notifies all subscribers
     */
    public markAsRead(id: string): void {
        const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        if (!readIds.includes(id)) {
            readIds.push(id);
            localStorage.setItem('readNotifications', JSON.stringify(readIds));
            this.triggerLocalUpdate();
        }
    }

    /**
     * Marks all notifications as read locally and notifies all subscribers
     */
    public markAllAsRead(): void {
        const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        const notifications = this.notificationsSubject.value;
        notifications.forEach(n => {
            if (!readIds.includes(n._id)) readIds.push(n._id);
        });
        localStorage.setItem('readNotifications', JSON.stringify(readIds));
        this.triggerLocalUpdate();
    }

    /**
     * Returns the current notifications list once (Observable)
     */
    getMyNotifications(): Observable<any[]> {
        return this.http.get<any>(`${this.apiUrl}/my`).pipe(
            map(res => res.notifications),
            tap(data => this.notificationsSubject.next(data))
        );
    }

    /**
     * Cleanup polling when service is destroyed
     */
    stopPolling() {
        if (this.pollInterval) clearInterval(this.pollInterval);
    }

    clearState() {
        this.notificationsSubject.next([]);
        this.totalSubject.next(0);
        this.currentPage = 1;
    }
}
