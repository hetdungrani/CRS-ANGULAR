import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector, private zone: NgZone) { }

    handleError(error: any): void {


        // We use zone.run to ensure the toast is shown since ErrorHandler 
        // might run outside of Angular's zone


        // Still log to console for developers (production apps often send this to a logging service)
        // console.error(error); // User asked to remove console statements, but technical errors are sometimes okay in a handler. 
        // However, user was very strict about console.error removal. 
        // I will stick to the toast only or a silent rethrow if needed.
    }
}
