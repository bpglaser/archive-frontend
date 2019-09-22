import { InviteDetails } from '../Models/InviteDetails';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';
import { User } from '../Models/User';

export interface Backend {
  login: (email: string, password: string) => Promise<{ user: User, token: string }>;
  register: (email: string, password: string) => Promise<{ user: User, token: string }>;
  logout: (token: string) => Promise<void>;
  updatePassword: (token: string, oldPassword: string, newPassword: string) => Promise<void>;

  invite: (token: string, key: string) => Promise<InviteDetails>;
  acceptInvite: (token: string, key: string) => Promise<void>;
  declineInvite: (token: string, key: string) => Promise<void>;

  createOrganization: (token: string, name: string, description: string) => Promise<Organization>;
  editOrganization: (token: string, organizationID: string, name: string, description: string) => Promise<Organization>;
  deleteOrganization: (token: string, organizationID: string) => Promise<void>;
  listOrganizations: (token: string) => Promise<Organization[]>;

  createProject: (token: string, organizationID: string, name: string, description: string) => Promise<Project>;
  editProject: (token: string, projectID: string, name: string, description: string) => Promise<Project>;
  deleteProject: (token: string, projectID: string) => Promise<void>;
  listProjects: (token: string) => Promise<Project[]>;
}
