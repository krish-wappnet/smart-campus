import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacultyComponent } from './faculty.component';
import { facultyRoutes } from './faculty.routes';
import { RouterModule } from '@angular/router';
import { LecturesComponent } from './lectures/lectures.component';
import { FacultySidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    FacultyComponent,
    LecturesComponent,
    FacultySidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(facultyRoutes)
  ]
})
export class FacultyModule { }
