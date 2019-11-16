export interface Organization {
  organizationID: number;
  name: string;
  description: string;
  isAdmin: boolean;
  projectCount: number;
  fileCount: number;
}
