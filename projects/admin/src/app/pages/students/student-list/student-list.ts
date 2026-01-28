import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../services/student.service';

@Component({
    selector: 'app-student-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './student-list.html',
})
export class StudentList implements OnInit {
    allStudents: any[] = [];
    students: any[] = [];
    loading = false;

    filters = {
        search: ''
    };

    constructor(
        private studentService: StudentService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.loadStudents();
    }

    loadStudents() {
        const data = this.route.snapshot.data['students'];
        if (data) {
            this.allStudents = data;
            this.applyFilters();
        }
    }

    applyFilters() {
        let filtered = [...this.allStudents];

        if (this.filters.search) {
            const searchLower = this.filters.search.toLowerCase();
            filtered = filtered.filter(student =>
                student.fullName?.toLowerCase().includes(searchLower) ||
                student.email?.toLowerCase().includes(searchLower) ||
                student.department?.toLowerCase().includes(searchLower) ||
                student.course?.toLowerCase().includes(searchLower)
            );
        }

        this.students = filtered;
    }
}
