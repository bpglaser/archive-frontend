import { Article } from '../Models/Article';
import { Comment } from '../Models/Comment';
import { File } from '../Models/File';
import { Invite } from '../Models/Invite';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';
import { User } from '../Models/User';
import { CancelTokenSource } from 'axios';

export interface Backend {
  login: (email: string, password: string) => Promise<{ user: User, token: string }>;
  register: (email: string, password: string) => Promise<{ user: User, token: string }>;
  logout: (token: string) => Promise<void>;
  updatePassword: (token: string, oldPassword: string, newPassword: string) => Promise<void>;
  updateUsername: (token: string, username: string) => Promise<{ user: User, token: string }>;
  getUserSuggestions: (token: string, search: string, tokenSource: CancelTokenSource) => Promise<User[]>;

  getInvites: (token: string) => Promise<Invite[]>;
  getPendingInvites: (token: string, organization: Organization) => Promise<Invite[]>;
  acceptInvite: (token: string, invite: Invite) => Promise<void>;
  cancelInvite: (token: string, invite: Invite) => Promise<void>;
  declineInvite: (token: string, invite: Invite) => Promise<void>;

  getArticles: () => Promise<Article[]>;
  getArticle: (articleID: number) => Promise<Article>;
  createArticle: (token: string, title: string, content: string) => Promise<Article>;
  updateArticle: (token: string, article: Article, title: string, content: string) => Promise<Article>;
  deleteArticle: (token: string, articleID: number) => Promise<void>;

  createOrganization: (token: string, name: string, description: string, admins: number[]) => Promise<Organization>;
  editOrganization: (token: string, organizationID: number, name: string, description: string) => Promise<Organization>;
  deleteOrganization: (token: string, organizationID: number) => Promise<void>;
  listOrganizations: (token: string) => Promise<Organization[]>;
  getOrganizationDetails: (token: string, organizationID: number) => Promise<Organization>;
  getOrganizationUsers: (token: string, organization: Organization) => Promise<{ user: User, isAdmin: boolean }[]>;
  setOrganizationAdmin: (token: string, organization: Organization, user: User, isAdmin: boolean) => Promise<void>;
  kickUserFromOrganization: (token: string, organization: Organization, user: User) => Promise<void>;
  inviteUserToOrganization: (token: string, organization: Organization, user: User) => Promise<Invite>;

  createProject: (token: string, organizationID: number, name: string, description: string) => Promise<Project>;
  editProject: (token: string, projectID: number, organizationID: number, name: string, description: string) => Promise<Project>;
  deleteProject: (token: string, projectID: number) => Promise<void>;
  listProjects: (token: string, organizationID: number) => Promise<Project[]>;
  getProjectDetails: (token: string | null, projectID: number) => Promise<Project>;
  getRecentProjects: (token: string) => Promise<Project[]>;
  getPublicProjects: () => Promise<Project[]>;

  getNearbyFiles: (token: string, fileID: number) => Promise<{ distance: number, file: File }[]>;
  uploadFile: (token: string, projectID: number, formData: FormData) => Promise<File>;
  downloadFile: (token: string, fileID: number, extension?: string) => Promise<Blob>;
  listFiles: (token: string | null, projID: number) => Promise<File[]>;
  getFileDetails: (token: string, fileID: number) => Promise<File>;
  updateFile: (token: string, file: File, name: string) => Promise<File>;
  deleteFile: (token: string, fileID: number) => Promise<void>;

  submitComment: (token: string, fileID: number, content: string) => Promise<Comment>;
  getComments: (token: string, fileID: number) => Promise<Comment[]>;
  editComment: (token: string, commentID: number, content: string) => Promise<Comment>;
  deleteComment: (token: string, commentID: number) => Promise<void>;

  getTags: (token: string | null, fileID: number) => Promise<string[]>;
  addTag: (token: string, fileID: number, tag: string) => Promise<void>;
  deleteTag: (token: string, fileID: number, tag: string) => Promise<void>;

  getMetadata: (token: string, fileID: number) => Promise<{ [key: string]: string }>;
}
