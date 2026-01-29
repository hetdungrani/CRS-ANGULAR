import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-student-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './student-list.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentList implements OnInit, OnDestroy {
    Math = Math;
    allStudents: any[] = [];
    students: any[] = [];
    loading = false;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();

    filters = {
        search: ''
    };

    // Pagination
    currentPage = 1;
    pageSize = 10;
    totalItems = 0;
    paginatedStudents: any[] = [];
    totalPages = 0;

    constructor(
        private studentService: StudentService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadStudents();

        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.currentPage = 1; // Reset to first page on search
            this.applyFilters();
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSearchChange() {
        this.searchSubject.next(this.filters.search);
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
        this.totalItems = filtered.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.paginate();
    }

    paginate() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedStudents = this.students.slice(startIndex, endIndex);
        this.cdr.markForCheck();
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.paginate();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.paginate();
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.paginate();
        }
    }

    // TrackBy function for performance optimization
    trackByStudentId(index: number, student: any): any {
        return student._id;
    }
}
