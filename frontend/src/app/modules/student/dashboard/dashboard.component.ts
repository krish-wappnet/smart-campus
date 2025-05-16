import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/auth/auth.selectors';
import { Observable } from 'rxjs';
import { User } from '../../../store/auth/auth.interface';
import { loadStudentDashboardData } from '../store/student.action';
import { selectAttendancePercentage, selectUpcomingClasses, selectLeaveRequests } from '../store/student.selectors';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,
  // imports: [CommonModule, RouterLink, RouterOutlet],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user$!: Observable<User | null>;
  attendancePercentage$!: Observable<number>;
  upcomingClasses$!: Observable<any[]>;
  leaveRequests$!: Observable<any[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadStudentDashboardData());
    
    this.user$ = this.store.select(selectUser);
    this.attendancePercentage$ = this.store.select(selectAttendancePercentage);
    this.upcomingClasses$ = this.store.select(selectUpcomingClasses);
    this.leaveRequests$ = this.store.select(selectLeaveRequests);
  }
}
