import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { studentRoutes } from './student.routes';
import { ClassEnrollmentComponent } from './class-enrollment/class-enrollment.component';

@NgModule({
  declarations: [
    ClassEnrollmentComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(studentRoutes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class StudentModule { }
