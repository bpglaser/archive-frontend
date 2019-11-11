import { User } from "./User";

export interface Project {
  projectID: number;
  organizationID: number;
  name: string;
  description: string;
  owner: User;
  public: boolean;
  lastModified?: Date;
}
