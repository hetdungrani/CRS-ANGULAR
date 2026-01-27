import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../services/student.service';

@Component({
    selector: 'app-student-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './student-detail.html',
})
export class StudentDetail implements OnInit {
    student: any;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private studentService: StudentService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadStudent(id);
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
                console.error('Error fetching student:', err);
                this.loading = false;
            }
        });
    }


}
