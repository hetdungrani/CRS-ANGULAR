import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, retry } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const router = inject(Router);
    const toastService = inject(ToastService);
    const token = localStorage.getItem('token');

    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: {
                'x-auth-token': token
            }
        });
    }

    return next(authReq).pipe(
        retry(req.method === 'GET' ? 1 : 0),
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Auto logout if 401 response returned from api
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userProfile');
                router.navigate(['/login']);
                toastService.error('Session expired. Please login again.');
            }

            const errorMsg = error.error?.msg || error.message || 'An unexpected error occurred';
            return throwError(() => new Error(errorMsg));
        })
    );
};
