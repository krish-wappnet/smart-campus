import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { LeaveRequest } from '../../../models/leave-request.model';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-leave-request-details',
  templateUrl: './leave-request-details.component.html',
  styleUrls: ['./leave-request-details.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, ]
})
export class LeaveRequestDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<LeaveRequestDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public request: LeaveRequest
  ) {
    console.log('Request details:', request);
  }

  close() {
    this.dialogRef.close();
  }
}
