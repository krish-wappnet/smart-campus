export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  type: string;
  message: string;
  user: User;
}
