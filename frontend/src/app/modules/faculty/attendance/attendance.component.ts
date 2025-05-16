import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectClasses } from '../store/faculty.selectors';
import { markAttendance } from '../store/faculty.action';
import { Observable } from 'rxjs';

interface Class {
  id: string;
  subject: string;
  batch: string;
  room: string;
}

interface Student {
  id: string;
  name: string;
  status: 'present' | 'absent';
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

@Component({
  selector: 'app-faculty-attendance',
  templateUrl: './attendance.component.html',
  standalone: false,
  // imports: [CommonModule],
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  attendance$!: Observable<Student[]>;
  classes$!: Observable<Class[]>;
  selectedClass: Class | null = null;
  students: Array<Student & { present: boolean; rollNumber: string }> = [];
  attendanceStats: AttendanceStats = {
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0
  };

  constructor(private store: Store) {}

  ngOnInit() {
    this.classes$ = this.store.select(selectClasses);
  }

  selectClass(selectedClass: Class) {
    this.selectedClass = selectedClass;
    this.loadStudents(selectedClass.id);
  }

  loadStudents(classId: string) {
    // This would typically be an API call to load students for the selected class
    // For now, we'll simulate with mock data
    this.attendance$ = new Observable(observer => {
      setTimeout(() => {
        observer.next([
          { id: '1', name: 'John Doe', status: 'present' },
          { id: '2', name: 'Jane Smith', status: 'absent' }
        ] as Student[]);
      }, 1000);
    });

    this.calculateAttendanceStats();
  }

  calculateAttendanceStats() {
    if (!this.selectedClass) return;
    
    this.attendance$.subscribe(students => {
      const present = students.filter(s => s.status === 'present').length;
      const total = students.length;
      const percentage = (present / total) * 100;
      
      this.attendanceStats = {
        total,
        present,
        absent: total - present,
        percentage: Math.round(percentage * 100) / 100
      };
    });
  }

  markStudentAttendance(studentId: string, status: 'present' | 'absent') {
    if (!this.selectedClass) return;
    
    this.store.dispatch(markAttendance({
      studentId,
      classId: this.selectedClass.id,
      status
    }));
  }
}
