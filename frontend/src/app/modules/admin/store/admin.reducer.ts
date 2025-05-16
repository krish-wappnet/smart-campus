import { createReducer, on } from '@ngrx/store';
import { AdminState, initialAdminState } from './admin.interface';
import { adminActions } from './admin.actions';
import { LeaveRequest } from '../../../models/leave-request.model';

const initialState: AdminState = {
  ...initialAdminState,
  leaveRequests: []
};

export const adminReducer = createReducer(
  initialState,
  on(adminActions.loadDashboardData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(adminActions.loadDashboardDataSuccess, (state, { totalUsers, totalClasses, totalRooms, pendingLeaves, recentActivities }) => ({
    ...state,
    loading: false,
    error: null,
    totalUsers,
    totalClasses,
    totalRooms,
    pendingLeaves,
    recentActivities
  })),
  on(adminActions.loadDashboardDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(adminActions.loadLeaveRequests, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(adminActions.loadLeaveRequestsSuccess, (state, { leaveRequests }) => ({
    ...state,
    loading: false,
    error: null,
    leaveRequests: leaveRequests as LeaveRequest[]
  })),
  on(adminActions.loadLeaveRequestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(adminActions.approveLeaveRequestSuccess, (state, { leaveRequest }) => ({
    ...state,
    leaveRequests: state.leaveRequests.map((request: LeaveRequest) => 
      request.id === leaveRequest.id ? { 
        ...request, 
        status: 'approved' as const,
        department: request.department,
        leaveType: request.leaveType
      } : request
    )
  })),
  on(adminActions.rejectLeaveRequestSuccess, (state, { leaveRequest }) => ({
    ...state,
    leaveRequests: state.leaveRequests.map((request: LeaveRequest) => 
      request.id === leaveRequest.id ? { 
        ...request, 
        ...request,
        status: 'rejected' as const,
        rejectionReason: leaveRequest.rejectionReason
      } : request
    )
  }))
);
