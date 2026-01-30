import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    // Ideally use environment.apiUrl
    private apiUrl = 'http://localhost:5000/api/admin/students';

    constructor(private http: HttpClient, private authService: AuthService) { }

    getAllStudents(filters: any = {}): Observable<any[]> {
        let params = new HttpParams();
        if (filters.branch) params = params.set('branch', filters.branch);
        if (filters.cgpa) params = params.set('cgpa', filters.cgpa);
        if (filters.skills) params = params.set('skills', filters.skills);
        if (filters.search) params = params.set('search', filters.search);

        return this.http.get<any[]>(this.apiUrl, { params });
    }

    getStudentById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    deleteStudent(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
