import { createAction, props } from '@ngrx/store';
import { LeaveRequest } from '../../../models/leave-request.model';
import { Class } from '../../../models/class.model';
import { Room } from '../../../models/room.model';
import { TimetableEntry } from '../../../models/timetable.model';
import { AttendanceReport } from '../../../models/attendance-report.model';
import { ActivityLog } from '../../../models/activity-log.model';
import { User } from '../../../store/auth/auth.interface';
import { Timeslot } from '../../../models/timeslot.model';

export const adminActions = {
  // Dashboard actions
  loadDashboardData: createAction('[Admin] Load Dashboard Data'),
  loadDashboardDataSuccess: createAction(
    '[Admin] Load Dashboard Data Success',
    props<{ 
      totalUsers: number;
      totalClasses: number;
      totalRooms: number;
      pendingLeaves: number;
      recentActivities: {
        id: string;
        type: string;
        description: string;
        time: Date;
      }[];
    }>()
  ),
  loadDashboardDataFailure: createAction(
    '[Admin] Load Dashboard Data Failure',
    props<{ error: string }>()
  ),

  // Leave requests actions
  loadLeaveRequests: createAction('[Admin] Load Leave Requests'),
  loadLeaveRequestsSuccess: createAction(
    '[Admin] Load Leave Requests Success',
    props<{ leaveRequests: LeaveRequest[] }>()
  ),
  loadLeaveRequestsFailure: createAction(
    '[Admin] Load Leave Requests Failure',
    props<{ error: string }>()
  ),
  approveLeaveRequest: createAction(
    '[Admin] Approve Leave Request',
    props<{ leaveRequest: LeaveRequest }>()
  ),
  approveLeaveRequestSuccess: createAction(
    '[Admin] Approve Leave Request Success',
    props<{ leaveRequest: LeaveRequest }>()
  ),
  approveLeaveRequestFailure: createAction(
    '[Admin] Approve Leave Request Failure',
    props<{ error: string }>()
  ),
  rejectLeaveRequest: createAction(
    '[Admin] Reject Leave Request',
    props<{ leaveRequest: LeaveRequest }>()
  ),
  rejectLeaveRequestSuccess: createAction(
    '[Admin] Reject Leave Request Success',
    props<{ leaveRequest: LeaveRequest }>()
  ),
  rejectLeaveRequestFailure: createAction(
    '[Admin] Reject Leave Request Failure',
    props<{ error: string }>()
  ),

  // Classes actions
  loadClasses: createAction('[Admin] Load Classes'),
  loadClassesSuccess: createAction(
    '[Admin] Load Classes Success',
    props<{ classes: Class[] }>()
  ),
  loadClassesFailure: createAction(
    '[Admin] Load Classes Failure',
    props<{ error: string }>()
  ),
  addClass: createAction(
    '[Admin] Add Class',
    props<{ class: Class }>()
  ),
  updateClass: createAction(
    '[Admin] Update Class',
    props<{ class: Class }>()
  ),
  deleteClass: createAction(
    '[Admin] Delete Class',
    props<{ classId: string }>()
  ),

  // Rooms actions
  loadRooms: createAction('[Admin] Load Rooms'),
  loadRoomsSuccess: createAction(
    '[Admin] Load Rooms Success',
    props<{ rooms: Room[] }>()
  ),
  loadRoomsFailure: createAction(
    '[Admin] Load Rooms Failure',
    props<{ error: string }>()
  ),
  addRoom: createAction(
    '[Admin] Add Room',
    props<{ room: Room }>()
  ),
  updateRoom: createAction(
    '[Admin] Update Room',
    props<{ room: Room }>()
  ),
  deleteRoom: createAction(
    '[Admin] Delete Room',
    props<{ roomId: string }>()
  ),

  // Timetable actions
  loadTimetable: createAction('[Admin] Load Timetable'),
  loadTimetableSuccess: createAction(
    '[Admin] Load Timetable Success',
    props<{ timetable: TimetableEntry[] }>()
  ),
  loadTimetableFailure: createAction(
    '[Admin] Load Timetable Failure',
    props<{ error: string }>()
  ),
  addTimetableEntry: createAction(
    '[Admin] Add Timetable Entry',
    props<{ timetableEntry: TimetableEntry }>()
  ),
  updateTimetableEntry: createAction(
    '[Admin] Update Timetable Entry',
    props<{ timetableEntry: TimetableEntry }>()
  ),
  deleteTimetableEntry: createAction(
    '[Admin] Delete Timetable Entry',
    props<{ entryId: string }>()
  ),

  // Attendance reports actions
  loadAttendanceReports: createAction('[Admin] Load Attendance Reports'),
  loadAttendanceReportsSuccess: createAction(
    '[Admin] Load Attendance Reports Success',
    props<{ reports: AttendanceReport[] }>()
  ),
  loadAttendanceReportsFailure: createAction(
    '[Admin] Load Attendance Reports Failure',
    props<{ error: string }>()
  ),

  // Activity logs actions
  loadActivityLogs: createAction('[Admin] Load Activity Logs'),
  loadActivityLogsSuccess: createAction(
    '[Admin] Load Activity Logs Success',
    props<{ logs: ActivityLog[] }>()
  ),
  loadActivityLogsFailure: createAction(
    '[Admin] Load Activity Logs Failure',
    props<{ error: string }>()
  ),

  // User actions
  loadUsers: createAction('[Admin] Load Users'),
  loadUsersSuccess: createAction(
    '[Admin] Load Users Success',
    props<{ users: User[] }>()
  ),
  loadUsersFailure: createAction(
    '[Admin] Load Users Failure',
    props<{ error: string }>()
  ),
  addUser: createAction(
    '[Admin] Add User',
    props<{ user: User }>()
  ),
  updateUser: createAction(
    '[Admin] Update User',
    props<{ user: User }>()
  ),
  deleteUser: createAction(
    '[Admin] Delete User',
    props<{ user: User }>()
  ),

  // Timeslot actions
  loadTimeslots: createAction('[Admin] Load Timeslots'),
  loadTimeslotsSuccess: createAction(
    '[Admin] Load Timeslots Success',
    props<{ timeslots: Timeslot[] }>()
  ),
  loadTimeslotsFailure: createAction(
    '[Admin] Load Timeslots Failure',
    props<{ error: string }>()
  ),
  addTimeslot: createAction(
    '[Admin] Add Timeslot',
    props<{ timeslot: Timeslot }>()
  ),
  updateTimeslot: createAction(
    '[Admin] Update Timeslot',
    props<{ timeslot: Timeslot }>()
  ),
  deleteTimeslot: createAction(
    '[Admin] Delete Timeslot',
    props<{ timeslotId: string }>()
  )
};
