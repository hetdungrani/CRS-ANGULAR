import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, retry } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const router = inject(Router);

    const token = localStorage.getItem('admin_token');

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
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_data');
                router.navigate(['/login']);

            }

            const errorMsg = error.error?.msg || error.message || 'An unexpected error occurred';
            return throwError(() => new Error(errorMsg));
        })
    );
};
