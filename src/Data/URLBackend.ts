import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { UNAUTHORIZED } from 'http-status-codes';
import { readTokenPayload } from '../Helpers';
import { Article } from '../Models/Article';
import { Comment } from '../Models/Comment';
import { File } from '../Models/File';
import { Backend } from './Backend';
import { MockBackend } from "./MockBackend";

export class URLBackend implements Backend {
  readonly base: string | undefined;
  readonly mock: MockBackend;
  readonly instance: AxiosInstance;

  constructor(base?: string, clientLogout?: () => void) {
    this.base = base;
    this.mock = new MockBackend(500);

    this.instance = Axios.create();
    if (clientLogout) {
      this.instance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === UNAUTHORIZED) {
            console.log('Caught UNAUTHORIZED return code. Logging out.')
            clientLogout();
          }
          return Promise.reject(error);
        }
      );
    }
  }

  login = async (email: string, password: string) => {
    const url = new URL('/api/users/login', this.base);
    const data = { email: email, password: password };
    const response = await this.instance.post(url.toString(), data);
    if (response.data.token === undefined) {
      throw new Error('Server returned invalid payload.');
    }
    const token: string = response.data.token;
    const user = readTokenPayload(token);
    return { user: user, token: token };
  }

  register = async (email: string, password: string) => {
    const url = new URL('/api/users/create', this.base);
    const data = { email: email, password: password };
    const response = await this.instance.post(url.toString(), data);
    if (response.data.token === undefined) {
      throw new Error('Server returned invalid payload.');
    }
    const token: string = response.data.token;
    const user = readTokenPayload(token);
    return { user: user, token: token };
  }

  logout = async (token: string) => {
    const url = new URL('/api/users/logout', this.base);
    const config = createAuthorizationConfig(token);
    await this.instance.post(url.toString(), null, config);
  }

  updatePassword = async (token: string, oldPassword: string, newPassword: string) => {
    const url = new URL('/api/users/password', this.base);
    const data = { old: oldPassword, new: newPassword };
    const config = createAuthorizationConfig(token);
    await this.instance.post(url.toString(), data, config);
  }

  updateUsername = async (token: string, username: string) => {
    return await this.mock.updateUsername(token, username);
  }

  invite = async (token: string, key: string) => {
    return await this.mock.invite(token, key);
  }

  acceptInvite = async (token: string, key: string) => {
    await this.mock.acceptInvite(token, key);
  }

  declineInvite = async (token: string, key: string) => {
    await this.mock.declineInvite(token, key);
  }

  getArticles = async () => {
    const url = new URL('/api/articles/', this.base);
    const result = await this.instance.get(url.toString());
    const entries: any[] = result.data;

    return entries.map((entry) => {
      return {
        articleID: Number(entry.articleid),
        headline: entry.headline as string,
        author: { userID: Number(entry.userid), email: entry.Email },
        published: new Date(entry.published),
        content: entry.content as string,
        snippet: entry.snippet as string,
      };
    });
  }

  getArticle = async (articleID: number) => {
    const url = new URL('/api/articles/' + articleID, this.base);
    const result = await this.instance.get(url.toString());
    const entry: any = result.data;

    return {
      articleID: Number(entry.articleid),
      headline: entry.headline as string,
      author: { userID: Number(entry.userid), email: entry.Email },
      published: new Date(entry.published),
      content: entry.content as string,
      snippet: entry.snippet as string,
    };
  }

  createArticle = async (token: string, title: string, content: string) => {
    const url = new URL('/api/articles/', this.base);
    const data = { headline: title, content: content };
    const config = createAuthorizationConfig(token);
    const result = await this.instance.post(url.toString(), data, config);

    const user = readTokenPayload(token);
    const article = {
      articleID: result.data.articleID,
      headline: title,
      author: user,
      content: content,
      published: new Date(result.data.published),
    };
    return article;
  }

  updateArticle = async (token: string, article: Article, title: string, content: string) => {
    const url = new URL('/api/articles/' + article.articleID, this.base);
    const data = { headline: title, content: content };
    const config = createAuthorizationConfig(token);
    const result = await this.instance.patch(url.toString(), data, config);

    return {
      articleID: article.articleID,
      headline: title,
      author: article.author,
      content: content,
      published: article.published,
      updated: new Date(result.data.updated),
    };
  }

  deleteArticle = async (token: string, articleID: number) => {
    const url = new URL('/api/articles/' + articleID, this.base);
    const config = createAuthorizationConfig(token);
    await this.instance.delete(url.toString(), config);
  }

  createOrganization = async (token: string, name: string, description: string) => {
    const url = new URL('/api/organizations/create', this.base);
    const data = { name: name, desc: description };
    const config = createAuthorizationConfig(token);

    const response = await this.instance.post(url.toString(), data, config);
    const organizationID = response.data.orgID;
    if (organizationID === undefined) {
      throw new Error('Invalid fields on response.');
    }
    return { organizationID: organizationID, name: name, description: description };
  }

  editOrganization = async (token: string, organizationID: number, name: string, description: string) => {
    const url = new URL('/api/organizations/edit', this.base);
    const data = { orgID: organizationID, name: name, desc: description };
    const config = createAuthorizationConfig(token);

    await this.instance.post(url.toString(), data, config);
    return { organizationID: organizationID, name: name, description: description };
  }

  deleteOrganization = async (token: string, organizationID: number) => {
    const url = new URL('/api/organizations/delete', this.base);
    const data = { orgID: organizationID };
    const config = createAuthorizationConfig(token);

    await this.instance.post(url.toString(), data, config);
  }

  listOrganizations = async (token: string) => {
    const url = new URL('/api/organizations/list', this.base);
    const config = createAuthorizationConfig(token);

    const response = await this.instance.get(url.toString(), config);
    return response.data.map((entry: any) => {
      return { organizationID: entry.OrgID, name: entry.Name, description: entry.Description };
    });
  }

  getOrganizationDetails = async (token: string, organizationID: number) => {
    const url = new URL('/api/organizations/details/' + organizationID, this.base);
    const config = createAuthorizationConfig(token);

    const response = await this.instance.get(url.toString(), config);
    const entry = response.data;
    return {
      organizationID: entry.OrgID,
      name: entry.Name,
      description: entry.Description
    };
  }

  createProject = async (token: string, organizationID: number, name: string, description: string) => {
    const url = new URL('/api/projects/create', this.base);
    const data = { orgID: organizationID, name: name, desc: description };
    const config = createAuthorizationConfig(token);

    const response = await this.instance.post(url.toString(), data, config);
    if (response.data.projID === undefined) {
      throw new Error('Invalid field on project creation response');
    }
    return { projectID: response.data.projID, organizationID: organizationID, name: name, description: description };
  }

  editProject = async (token: string, projectID: number, organizationID: number, name: string, description: string) => {
    const url = new URL('/api/projects/edit', this.base);
    const data = { projID: projectID, orgID: organizationID, name: name, desc: description };
    const config = createAuthorizationConfig(token);

    await this.instance.post(url.toString(), data, config);
    return { projectID: projectID, organizationID: organizationID, name: name, description: description };
  }

  deleteProject = async (token: string, projectID: number) => {
    const url = new URL('/api/projects/delete', this.base);
    const data = { projID: projectID };
    const config = createAuthorizationConfig(token);

    await this.instance.post(url.toString(), data, config);
  }

  listProjects = async (token: string, organizationID: number) => {
    const url = new URL('/api/projects/list/' + organizationID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await this.instance.get(url.toString(), config);
    return result.data.map((entry: any) => {
      return { projectID: entry.ProjID, organizationID: entry.OrgID, name: entry.Name, description: entry.Description };
    });
  }

  getProjectDetails = async (token: string, projectID: number) => {
    const url = new URL('/api/projects/details/' + projectID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await this.instance.get(url.toString(), config);
    const entry = result.data;
    return {
      projectID: entry.ProjID,
      organizationID: entry.OrgID,
      name: entry.Name,
      description: entry.Description
    };
  }

  getRecentProjects = async (token: string) => {
    const url = new URL('/api/projects/list/modified?count=5', this.base);
    const config = createAuthorizationConfig(token);
    const result = await this.instance.get(url.toString(), config);
    return result.data.map((entry: any) => {
      return {
        projectID: Number(entry.ProjID),
        organizationID: Number(entry.OrgID),
        name: entry.Name,
        description: entry.Description,
        lastModified: new Date(entry.LastModified),
      }
    });
  }

  getNearbyFiles = async (token: string, fileID: number) => {
    const url = new URL('/api/files/list/nearby/' + fileID, this.base);
    const config = createAuthorizationConfig(token);
    const result = await this.instance.get(url.toString(), config);
    return result.data.map(parseNearby);
  }

  uploadFile = async (token: string, projectID: number, formData: FormData) => {
    const url = new URL('/api/files/upload/' + projectID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await this.instance.post(url.toString(), formData, config);
    const file = parseFileEntry(result.data);
    file.uploader = readTokenPayload(token);
    return file;
  }

  downloadFile = async (token: string, fileID: number, extension?: string) => {
    const url = new URL('/api/files/download/' + fileID, this.base);
    if (extension) {
      url.searchParams.set('extension', extension);
    }
    const config = createAuthorizationConfig(token);
    config.responseType = 'arraybuffer';

    const result = await this.instance.post(url.toString(), null, config);
    return new Blob([result.data]);
  }

  listFiles = async (token: string, projectID: number) => {
    const url = new URL('/api/files/list/' + projectID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await this.instance.get(url.toString(), config);
    return result.data.map(parseFileEntry);
  }

  getFileDetails = async (token: string, fileID: number) => {
    const url = new URL('/api/files/' + fileID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await this.instance.get(url.toString(), config);
    const entry = result.data;
    return parseFileEntry(entry);
  }

  updateFile = async (token: string, file: File, name: string) => {
    const url = new URL('/api/files/' + file.fileID, this.base);
    const config = createAuthorizationConfig(token);
    const data = { name: name };

    await this.instance.patch(url.toString(), data, config);
    return { ...file, name: name };
  }

  deleteFile = async (token: string, fileID: number) => {
    const url = new URL('/api/files/' + fileID, this.base);
    const config = createAuthorizationConfig(token);
    await this.instance.delete(url.toString(), config);
  }

  submitComment = async (token: string, fileID: number, content: string) => {
    const url = new URL('/api/comments/' + fileID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await this.instance.post(url.toString(), { comment: content }, config);
    const comment = parseCommentEntry(result.data);
    comment.user = readTokenPayload(token);
    return comment;
  }

  getComments = async (token: string, fileID: number) => {
    const url = new URL('/api/comments/' + fileID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await this.instance.get(url.toString(), config);
    return result.data.map(parseCommentEntry);
  }

  editComment = async (token: string, commentID: number, content: string) => {
    const url = new URL('/api/comments/' + commentID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await this.instance.patch(url.toString(), { comment: content }, config);
    const comment = parseCommentEntry(result.data);
    comment.user = readTokenPayload(token);
    return comment;
  }

  deleteComment = async (token: string, commentID: number) => {
    const url = new URL('/api/comments/' + commentID, this.base);
    const config = createAuthorizationConfig(token);
    await this.instance.delete(url.toString(), config);
  }

  getTags = async (token: string, fileID: number) => {
    const url = new URL('/api/tags/' + fileID, this.base);
    const config = createAuthorizationConfig(token);
    const response = await this.instance.get(url.toString(), config);
    return response.data;
  }

  addTag = async (token: string, fileID: number, tag: string) => {
    const url = new URL('/api/tags/' + fileID, this.base);
    const config = createAuthorizationConfig(token);
    const data = { tag: tag };
    await this.instance.post(url.toString(), data, config);
  }

  deleteTag = async (token: string, fileID: number, tag: string) => {
    const url = new URL('/api/tags/' + fileID, this.base);
    const config = createAuthorizationConfig(token);
    config.data = { tag: tag };
    await this.instance.delete(url.toString(), config);
  }

  getMetadata = async (token: string, fileID: number) => {
    const url = new URL('/api/metadata/' + fileID, this.base);
    const config = createAuthorizationConfig(token);
    const result = await this.instance.get(url.toString(), config);
    return result.data;
  }
}

function parseCommentEntry(entry: any): Comment {
  return {
    commentID: Number(entry.CommentID),
    content: entry.Comment,
    published: new Date(entry.Published),
    user: { userID: Number(entry.UserID), email: entry.Email },
    updated: entry.Updated ? new Date(entry.Updated) : null,
  }
}

function parseFileEntry(entry: any): File {
  const result: File = {
    fileID: Number(entry.FileID),
    name: entry.Name,
  };

  if (entry.ProjID) {
    result.projID = Number(entry.ProjID);
  }

  if (entry.Uploader) {
    result.uploader = {
      userID: Number(entry.Uploader.UserID),
      email: entry.Uploader.Email,
    };
  }

  if (entry.OriginalName) {
    result.originalName = entry.OriginalName;
  }

  return result;
}

function parseNearby(entry: any): { distance: number, file: File } {
  return {
    distance: Number(entry.distance),
    file: parseFileEntry(entry.file)
  };
}

function createAuthorizationConfig(token: string): AxiosRequestConfig {
  return { headers: { Authorization: 'Bearer ' + token } };
}
