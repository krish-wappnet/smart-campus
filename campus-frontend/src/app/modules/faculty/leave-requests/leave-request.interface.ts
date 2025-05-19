export interface LeaveRequest {
  id?: string;
  facultyId: string;
  startDate: string;
  endDate: string;
  reason: string;
  substituteId?: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}
