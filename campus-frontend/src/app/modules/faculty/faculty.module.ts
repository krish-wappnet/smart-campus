import { FacultyComponent } from './faculty.component';
import { ManageLeaveRequestsComponent } from './leave-requests/manage-leave-requests/manage-leave-requests.component';
import { facultyRoutes } from './faculty.routes';
import { RouterModule } from '@angular/router';

export const FACULTY_COMPONENTS = [
  FacultyComponent,
  ManageLeaveRequestsComponent
];

export const FACULTY_MODULES = [
  RouterModule.forChild(facultyRoutes)
];
