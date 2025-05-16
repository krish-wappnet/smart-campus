import { User } from '../../../store/auth/auth.interface';
import { AttendanceReport } from '../../../models/attendance-report.model';
import { Class } from '../../../models/class.model';
import { LeaveRequest } from '../../../models/leave-request.model';

export interface AdminState {
  loading: boolean;
  error: string | null;
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
  user: User | null;
  users: User[];
  leaveRequests: LeaveRequest[];
  reports: AttendanceReport[];
  classes: Class[];
}

export const initialAdminState: AdminState = {
  loading: false,
  error: null,
  totalUsers: 0,
  totalClasses: 0,
  totalRooms: 0,
  pendingLeaves: 0,
  recentActivities: [],
  user: null,
  users: [],
  leaveRequests: [],
  reports: [],
  classes: []
};
