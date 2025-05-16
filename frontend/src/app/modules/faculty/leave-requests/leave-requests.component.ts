import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLeaveRequests } from '../store/faculty.selectors';
import { requestLeave } from '../store/faculty.action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-faculty-leave-requests',
  templateUrl: './leave-requests.component.html',
  standalone: false,
  // imports: [CommonModule, RouterLink],
  styleUrls: ['./leave-requests.component.scss']
})
export class LeaveRequestsComponent implements OnInit {
  leaveRequests$!: Observable<any[]>;
  leaveTypes = ['Medical', 'Casual', 'Emergency', 'Sick'];
  leaveRequest = {
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  };

  constructor(private store: Store) {}

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

  getLeaveStatusColor(status: 'Pending' | 'Approved' | 'Rejected') {
    const statusColors = {
      Pending: '#4CAF50',
      Approved: '#2196F3',
      Rejected: '#f44336'
    } as const;
    return statusColors[status] || '#666';
  }
}
