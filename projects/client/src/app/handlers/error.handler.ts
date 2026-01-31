import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { ToastService } from '../components/shared/toast/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector, private zone: NgZone) { }

    handleError(error: any): void {
        const toastService = this.injector.get(ToastService);

        this.zone.run(() => {
            const message = error.message || 'An unexpected error occurred';

            // Ignore Angular Lifecycle dev-mode errors
            if (message.includes('NG0100') || message.includes('ExpressionChangedAfterItHasBeenCheckedError')) {
                return;
            }

            toastService.error(message);
        });
    }
}
