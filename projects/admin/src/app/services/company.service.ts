import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private apiUrl = 'http://localhost:5000/api/admin/companies';

    constructor(private http: HttpClient, private authService: AuthService) { }

    createCompany(companyData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, companyData);
    }

    getAllCompanies(filters: any = {}): Observable<any[]> {
        let params = new HttpParams();
        if (filters.search) params = params.set('search', filters.search);
        if (filters.industry) params = params.set('industry', filters.industry);
        if (filters.status) params = params.set('status', filters.status);

        return this.http.get<any[]>(this.apiUrl, { params });
    }

    getCompanyById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    updateCompany(id: string, companyData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, companyData);
    }

    deleteCompany(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
