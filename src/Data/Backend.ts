import { Article } from '../Models/Article';
import { File } from '../Models/File';
import { InviteDetails } from '../Models/InviteDetails';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';
import { User } from '../Models/User';
import { Comment } from '../Models/Comment';

export interface Backend {
  login: (email: string, password: string) => Promise<{ user: User, token: string }>;
  register: (email: string, password: string) => Promise<{ user: User, token: string }>;
  logout: (token: string) => Promise<void>;
  updatePassword: (token: string, oldPassword: string, newPassword: string) => Promise<void>;

  invite: (token: string, key: string) => Promise<InviteDetails>;
  acceptInvite: (token: string, key: string) => Promise<void>;
  declineInvite: (token: string, key: string) => Promise<void>;

  getArticles: () => Promise<Article[]>;
  getArticle: (articleID: number) => Promise<Article>;
  createArticle: (token: string, title: string, content: string) => Promise<Article>;
  updateArticle: (token: string, article: Article, title: string, content: string) => Promise<Article>;
  deleteArticle: (token: string, articleID: number) => Promise<void>;

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

  getNearbyFiles: (token: string, fileID: number) => Promise<File[]>;
  uploadFile: (token: string, projectID: number, formData: FormData) => Promise<File>;
  downloadFile: (token: string, fileID: number, extension?: string) => Promise<Blob>;
  listFiles: (token: string, projID: number) => Promise<File[]>;
  getFileDetails: (token: string, fileID: number) => Promise<File>;
  updateFile: (token: string, file: File, name: string) => Promise<File>;
  deleteFile: (token: string, fileID: number) => Promise<void>;

  submitComment: (token: string, fileID: number, content: string) => Promise<Comment>;
  getComments: (token: string, fileID: number) => Promise<Comment[]>;
  editComment: (token: string, commentID: number, content: string) => Promise<Comment>;
  deleteComment: (token: string, commentID: number) => Promise<void>;

  getTags: (token: string, fileID: number) => Promise<string[]>;
  addTag: (token: string, fileID: number, tag: string) => Promise<void>;
  deleteTag: (token: string, fileID: number, tag: string) => Promise<void>;
}
