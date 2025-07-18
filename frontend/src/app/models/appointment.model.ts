export interface Appointment {
  id?: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  location?: string;
  status: AppointmentStatus;
  clientId: number;
  clientName?: string;
  projectId?: number;
  projectName?: string;
}

export interface AppointmentForm {
  appointmentDate?: string | null;
  startTime?: string;
  endTime?: string;
  notes?: string;
  location?: string;
  status?: AppointmentStatus;
  clientId?: number;
  projectId?: number;
  date?: string | null;
  time?: string;
  duration?: number;
  recurring?: string;
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export const AppointmentStatusLabels = {
  [AppointmentStatus.SCHEDULED]: 'Scheduled',
  [AppointmentStatus.IN_PROGRESS]: 'In Progress',
  [AppointmentStatus.COMPLETED]: 'Completed',
  [AppointmentStatus.CANCELLED]: 'Cancelled',
  [AppointmentStatus.NO_SHOW]: 'No Show'
};

export const AppointmentStatusColors = {
  [AppointmentStatus.SCHEDULED]: 'primary',
  [AppointmentStatus.IN_PROGRESS]: 'accent',
  [AppointmentStatus.COMPLETED]: 'success',
  [AppointmentStatus.CANCELLED]: 'warn',
  [AppointmentStatus.NO_SHOW]: 'warn'
};