import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Role } from '../../core/models/role.enum';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ClassesComponent } from './classes/classes.component';
import { RoomsComponent } from './rooms/rooms.component';
import { TimeslotsComponent } from './timeslots/timeslots.component';
import { TimetableComponent } from './timetable/timetable.component';
import { LeaveRequestsComponent } from './leave-requests/leave-requests.component';
import { AttendanceReportsComponent } from './attendance-reports/attendance-reports.component';
import { ActivityLogsComponent } from './activity-logs/activity-logs.component';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { adminReducer } from './store/admin.reducer';
import { AdminEffects } from './store/admin.effects';
import { adminRoutes } from './admin.routes';

export const adminConfig = {
  providers: [
    provideRouter(adminRoutes),
    provideStore({ admin: adminReducer }),
    provideEffects(AdminEffects),
    AuthGuard,
    RoleGuard
  ]
};
export class AdminModule { }
