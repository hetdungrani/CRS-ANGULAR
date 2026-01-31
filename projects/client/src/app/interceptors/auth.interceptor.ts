import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, retry } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const router = inject(Router);

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
            if (error.status === 401 || (error.status === 404 && error.error?.msg === 'User not found')) {
                // Auto logout if 401 response or 404 User Not Found returned from api
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userProfile');
                router.navigate(['/login'], { queryParams: { deleted: 'true' } });

                const msg = error.error?.msg || 'Session expired. Please login again.';

            }

            const errorMsg = error.error?.msg || error.message || 'An unexpected error occurred';
            return throwError(() => new Error(errorMsg));
        })
    );
};
