import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector, private zone: NgZone) { }

    handleError(error: any): void {
        const toastService = this.injector.get(ToastService);

        // We use zone.run to ensure the toast is shown since ErrorHandler 
        // might run outside of Angular's zone
        this.zone.run(() => {
            const message = error.message || 'An unexpected error occurred';
            toastService.error(`Application Error: ${message}`);
        });

        // Still log to console for developers (production apps often send this to a logging service)
        // console.error(error); // User asked to remove console statements, but technical errors are sometimes okay in a handler. 
        // However, user was very strict about console.error removal. 
        // I will stick to the toast only or a silent rethrow if needed.
    }
}
