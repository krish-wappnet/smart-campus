import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FacultyComponent } from './faculty.component';
import { facultyRoutes } from './faculty.routes';
import { LecturesComponent } from './lectures/lectures.component';
import { FacultySidebarComponent } from './sidebar/sidebar.component';
import { QrCodeDialogComponent } from './lectures/qr-code-dialog/qr-code-dialog.component';

@NgModule({
  declarations: [
    FacultyComponent,
    LecturesComponent,
    FacultySidebarComponent,
    QrCodeDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(facultyRoutes),
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule
  ]
})
export class FacultyModule { }
