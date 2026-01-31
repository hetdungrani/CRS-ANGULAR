import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { ToastService } from '../../../components/shared/toast/toast.service';
import { ModalService } from '../../../components/shared/modal/modal.service';

@Component({
    selector: 'app-student-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './student-detail.html',
})
export class StudentDetail implements OnInit {
    student: any;
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private studentService: StudentService,
        private location: Location,
        private toastService: ToastService,
        private modalService: ModalService
    ) { }

    ngOnInit() {
        // Use resolved data - no manual API call
        this.student = this.route.snapshot.data['student'];
        if (!this.student) {
            // Fallback: if resolver failed or data not available
            const id = this.route.snapshot.paramMap.get('id');
            if (id) {
                this.loadStudent(id);
            }
        }
    }

    loadStudent(id: string) {
        this.loading = true;
        this.studentService.getStudentById(id).subscribe({
            next: (data) => {
                this.student = data;
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                const errorMsg = err.error?.msg || err.message || 'Failed to load student details';
                this.toastService.error(errorMsg);
            }
        });
    }

    goBack() {
        this.location.back();
    }

    async deleteStudent() {
        if (!this.student || !this.student._id) return;

        const confirmed = await this.modalService.confirm(
            'Delete Student',
            'Are you sure you want to delete this student? This action cannot be undone.',
            'Delete',
            'Cancel',
            'danger'
        );

        if (confirmed) {
            this.loading = true;
            this.studentService.deleteStudent(this.student._id).subscribe({
                next: () => {
                    this.loading = false;
                    this.toastService.success('Student deleted successfully');
                    this.router.navigate(['/students']);
                },
                error: (err) => {
                    this.loading = false;
                    const errorMsg = err.error?.msg || err.message || 'Failed to delete student';
                    this.toastService.error(errorMsg);
                }
            });
        }
    }
}
