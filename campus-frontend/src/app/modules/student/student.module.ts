import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { studentRoutes } from './student.routes';
import { ClassEnrollmentComponent } from './class-enrollment/class-enrollment.component';
import { QrCodeDialogComponent } from './class-enrollment/qr-code-dialog.component';
import { AttendanceModule } from './attendance/attendance.module';

@NgModule({
  declarations: [
    ClassEnrollmentComponent,
    QrCodeDialogComponent,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(studentRoutes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    AttendanceModule
  ],
  exports: [
    QrCodeDialogComponent
  ]
})
export class StudentModule { }
