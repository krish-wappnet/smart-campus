export interface LeaveRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  facultyId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  substituteId?: string;
  adminComments?: string;
}

export interface UpdateLeaveRequest {
  status: 'pending' | 'approved' | 'rejected';
  substituteId?: string;
  adminComments?: string;
}
