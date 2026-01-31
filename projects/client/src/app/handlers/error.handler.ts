import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector, private zone: NgZone) { }

    handleError(error: any): void {


        this.zone.run(() => {
            const message = error.message || 'An unexpected error occurred';

        });
    }
}
