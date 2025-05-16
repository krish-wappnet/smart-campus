import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/auth/auth.selectors';
import { Observable } from 'rxjs';
import { User } from '../../../store/auth/auth.interface';
import { loadFacultyDashboardData } from '../store/faculty.action';
import { selectClasses, selectSchedule, selectLeaveRequests, selectAttendanceStats } from '../store/faculty.selectors';

@Component({
  selector: 'app-faculty-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,
  // imports: [CommonModule, RouterLink, RouterOutlet],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user$!: Observable<User | null>;
  classes$!: Observable<any[]>;
  schedule$!: Observable<any[]>;
  leaveRequests$!: Observable<any[]>;
  attendanceStats$!: Observable<any>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadFacultyDashboardData());
    
    this.user$ = this.store.select(selectUser);
    this.classes$ = this.store.select(selectClasses);
    this.schedule$ = this.store.select(selectSchedule);
    this.leaveRequests$ = this.store.select(selectLeaveRequests);
    this.attendanceStats$ = this.store.select(selectAttendanceStats);
  }
}
