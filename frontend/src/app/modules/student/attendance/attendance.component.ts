import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAttendanceHistory, selectClasses } from '../store/student.selectors';
import { markAttendance } from '../store/student.action';
import { Observable } from 'rxjs';

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

interface Class {
  id: string;
  name: string;
  room?: string;
  batch?: string;
  subject?: string;
}

@Component({
  selector: 'app-student-attendance',
  templateUrl: './attendance.component.html',
  standalone: false,
  // imports: [CommonModule],
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  attendanceHistory$!: Observable<any[]>;
  classes$!: Observable<Class[]>;
  selectedClass: Class | null = null;
  attendanceStats: AttendanceStats = {
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0
  };

  constructor(private store: Store) {}

  ngOnInit() {
    this.attendanceHistory$ = this.store.select(selectAttendanceHistory);
    this.classes$ = this.store.select(selectClasses);
  }

  selectClass(selectedClass: Class) {
    this.selectedClass = selectedClass;
    this.calculateAttendanceStats(selectedClass.id);
  }

  calculateAttendanceStats(classId: string) {
    // This would typically be calculated from attendance history
    // For now, we'll simulate with mock data
    this.attendanceStats = {
      total: 30,
      present: 25,
      absent: 5,
      percentage: 83.33
    };
  }

  markAttendance(status: 'present' | 'absent') {
    if (!this.selectedClass) return;
    
    this.store.dispatch(markAttendance({
      classId: this.selectedClass.id,
      status
    }));
  }
}
