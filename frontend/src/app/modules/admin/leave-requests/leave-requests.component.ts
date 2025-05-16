import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveRequest } from '../../../models/leave-request.model';
import { LeaveRequestDialogComponent } from './leave-request-dialog.component';
import { LeaveRequestDetailsComponent } from './leave-request-details.component';
import { selectLeaveRequests } from '../store/admin.selector';
import { adminActions } from '../store/admin.actions';
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonMaterialModule } from '../common-material.module';

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.scss'],
  standalone: true,
  imports: [CommonMaterialModule, CommonModule, ReactiveFormsModule, LeaveRequestDialogComponent]
})
export class LeaveRequestsComponent implements OnInit {
  leaveRequests$!: Observable<LeaveRequest[]>;
  filteredRequests$!: Observable<LeaveRequest[]>;
  searchForm: FormGroup;
  statusFilter: string = '';
  searchQuery = '';
filteredRequests: any;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit() {
    this.leaveRequests$ = this.store.select(selectLeaveRequests);
    this.filteredRequests$ = this.leaveRequests$.pipe(
      map((requests) => requests.filter(request => {
        const searchTerm = this.searchForm.get('searchTerm');
        const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm?.value?.toLowerCase() || '') ||
        request.status.toLowerCase().includes(this.statusFilter.toLowerCase());
        return matchesSearch;
      }))
    );
    this.loadLeaveRequests();
  }

  loadLeaveRequests() {
    this.store.dispatch(adminActions.loadLeaveRequests());
  }

  approveRequest(request: LeaveRequest) {
    this.store.dispatch(adminActions.approveLeaveRequest({ leaveRequest: request }));
  }

  rejectRequest(request: LeaveRequest) {
    const reason = prompt('Please enter the reason for rejection:');
    if (reason) {
      this.store.dispatch(adminActions.rejectLeaveRequest({ leaveRequest: { ...request, rejectionReason: reason } }));
    }
  }

  viewDetails(request: LeaveRequest) {
    this.dialog.open(LeaveRequestDetailsComponent, {
      width: '500px',
      data: request
    });
  }

  // Remove the getter since we're now using filteredRequests$ observable
}
