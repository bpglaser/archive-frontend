import { File } from '../Models/File';
import { InviteDetails } from '../Models/InviteDetails';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';
import { User } from '../Models/User';
import { Article } from '../Models/Article';

export interface Backend {
  login: (email: string, password: string) => Promise<{ user: User, token: string }>;
  register: (email: string, password: string) => Promise<{ user: User, token: string }>;
  logout: (token: string) => Promise<void>;
  updatePassword: (token: string, oldPassword: string, newPassword: string) => Promise<void>;

  invite: (token: string, key: string) => Promise<InviteDetails>;
  acceptInvite: (token: string, key: string) => Promise<void>;
  declineInvite: (token: string, key: string) => Promise<void>;

  getArticles: () => Promise<Article[]>;

  createOrganization: (token: string, name: string, description: string) => Promise<Organization>;
  editOrganization: (token: string, organizationID: number, name: string, description: string) => Promise<Organization>;
  deleteOrganization: (token: string, organizationID: number) => Promise<void>;
  listOrganizations: (token: string) => Promise<Organization[]>;
  getOrganizationDetails: (token: string, organizationID: number) => Promise<Organization>;

  createProject: (token: string, organizationID: number, name: string, description: string) => Promise<Project>;
  editProject: (token: string, projectID: number, organizationID: number, name: string, description: string) => Promise<Project>;
  deleteProject: (token: string, projectID: number) => Promise<void>;
  listProjects: (token: string, organizationID: number) => Promise<Project[]>;
  getProjectDetails: (token: string, projectID: number) => Promise<Project>;
  getRecentProjects: (token: string) => Promise<Project[]>;

  uploadFile: (token: string, projectID: number, formData: FormData) => Promise<File>;
}
