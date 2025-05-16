import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLeaveRequests } from '../store/student.selectors';
import { requestLeave } from '../store/student.action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-student-leave-requests',
  templateUrl: './leave-requests.component.html',
  standalone:false,
  styleUrls: ['./leave-requests.component.scss']
})
export class LeaveRequestsComponent implements OnInit {
  leaveRequests$!: Observable<any[]>;
  leaveTypes = ['Medical', 'Casual', 'Emergency'];
  leaveRequest = {
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  };

  constructor(private store: Store) {
    this.leaveRequests$ = this.store.select(selectLeaveRequests);
  }

  ngOnInit() {
    this.leaveRequests$ = this.store.select(selectLeaveRequests);
  }

  submitLeaveRequest() {
    this.store.dispatch(requestLeave({ leaveRequest: { ...this.leaveRequest } }));
    this.leaveRequest = {
      type: '',
      startDate: '',
      endDate: '',
      reason: ''
    };
  }
}
