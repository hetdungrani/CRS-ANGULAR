import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../../services/student.service';

@Component({
    selector: 'app-student-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './student-list.html',
})
export class StudentList implements OnInit {
    students: any[] = [];
    loading = false;

    filters = {
        search: ''
    };

    constructor(private studentService: StudentService) { }

    ngOnInit() {
        this.loadStudents();
    }

    loadStudents() {
        this.loading = true;
        this.studentService.getAllStudents(this.filters).subscribe({
            next: (data) => {
                this.students = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching students:', err);
                this.loading = false;
            }
        });
    }

    applyFilters() {
        this.loadStudents();
    }
}
