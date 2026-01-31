import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';

import { Location } from '@angular/common';

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

        private location: Location
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

            }
        });
    }

    goBack() {
        this.location.back();
    }

    deleteStudent() {
        if (!this.student || !this.student._id) {

            return;
        }

        if (confirm('Are you sure you want to delete this student?')) {
            this.loading = true;
            this.studentService.deleteStudent(this.student._id).subscribe({
                next: () => {
                    this.loading = false;

                    this.router.navigate(['/students']);
                },
                error: (err) => {
                    this.loading = false;
                    const errorMsg = err.error?.msg || err.message || 'Failed to delete student';

                }
            });
        }
    }
}
