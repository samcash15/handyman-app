export interface Project {
  id?: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  hourlyRate: number;
  clientId: number;
  clientName?: string;
}

export interface ProjectForm {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  hourlyRate: number;
  clientId: number;
}

export enum ProjectStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export const ProjectStatusLabels = {
  [ProjectStatus.PENDING]: 'Pending',
  [ProjectStatus.IN_PROGRESS]: 'In Progress',
  [ProjectStatus.COMPLETED]: 'Completed',
  [ProjectStatus.CANCELLED]: 'Cancelled'
};