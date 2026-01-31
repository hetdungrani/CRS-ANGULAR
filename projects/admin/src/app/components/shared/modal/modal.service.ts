import { Injectable, signal } from '@angular/core';

export interface ModalData {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: 'danger' | 'warning' | 'info';
    resolve: (result: boolean) => void;
}

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    modal = signal<ModalData | null>(null);

    confirm(
        title: string,
        message: string,
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        type: 'danger' | 'warning' | 'info' = 'warning'
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.modal.set({
                title,
                message,
                confirmText,
                cancelText,
                type,
                resolve
            });
        });
    }

    close(result: boolean) {
        const current = this.modal();
        if (current) {
            current.resolve(result);
            this.modal.set(null);
        }
    }
}
