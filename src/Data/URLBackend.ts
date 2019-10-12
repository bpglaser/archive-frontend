import Axios, { AxiosRequestConfig } from 'axios';
import { readTokenPayload } from '../Helpers';
import { Article } from '../Models/Article';
import { Backend } from './Backend';
import { MockBackend } from "./MockBackend";

export class URLBackend implements Backend {
  base: string | undefined;
  mock: MockBackend;

  constructor(base?: string) {
    this.base = base;
    this.mock = new MockBackend(500);
  }

  login = async (email: string, password: string) => {
    const url = new URL('/api/users/login', this.base);
    const data = { email: email, password: password };
    const response = await Axios.post(url.toString(), data);
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
    const response = await Axios.post(url.toString(), data);
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
    await Axios.post(url.toString(), null, config);
  }

  updatePassword = async (token: string, oldPassword: string, newPassword: string) => {
    const url = new URL('/api/users/password', this.base);
    const data = { old: oldPassword, new: newPassword };
    const config = createAuthorizationConfig(token);
    await Axios.post(url.toString(), data, config);
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
    const result = await Axios.get(url.toString());
    const entries: any[] = result.data;

    return entries.map((entry) => {
      return {
        articleID: Number(entry.articleid),
        headline: entry.headline as string,
        author: { userID: String(entry.userid), email: entry.Email },
        published: new Date(entry.published),
        content: entry.content as string,
        snippet: entry.snippet as string,
      };
    });
  }

  getArticle = async (articleID: number) => {
    const url = new URL('/api/articles/' + articleID, this.base);
    const result = await Axios.get(url.toString());
    const entry: any = result.data;

    return {
      articleID: Number(entry.articleid),
      headline: entry.headline as string,
      author: { userID: String(entry.userid), email: entry.Email },
      published: new Date(entry.published),
      content: entry.content as string,
      snippet: entry.snippet as string,
    };
  }

  createArticle = async (token: string, title: string, content: string) => {
    const url = new URL('/api/articles/', this.base);
    const data = { headline: title, content: content };
    const config = createAuthorizationConfig(token);
    const result = await Axios.post(url.toString(), data, config);

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
    const result = await Axios.patch(url.toString(), data, config);

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
    await Axios.delete(url.toString(), config);
  }

  createOrganization = async (token: string, name: string, description: string) => {
    const url = new URL('/api/organizations/create', this.base);
    const data = { name: name, desc: description };
    const config = createAuthorizationConfig(token);

    const response = await Axios.post(url.toString(), data, config);
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

    await Axios.post(url.toString(), data, config);
    return { organizationID: organizationID, name: name, description: description };
  }

  deleteOrganization = async (token: string, organizationID: number) => {
    const url = new URL('/api/organizations/delete', this.base);
    const data = { orgID: organizationID };
    const config = createAuthorizationConfig(token);

    await Axios.post(url.toString(), data, config);
  }

  listOrganizations = async (token: string) => {
    const url = new URL('/api/organizations/list', this.base);
    const config = createAuthorizationConfig(token);

    const response = await Axios.get(url.toString(), config);
    return response.data.map((entry: any) => {
      return { organizationID: entry.OrgID, name: entry.Name, description: entry.Description };
    });
  }

  getOrganizationDetails = async (token: string, organizationID: number) => {
    const url = new URL('/api/organizations/details/' + organizationID, this.base);
    const config = createAuthorizationConfig(token);

    const response = await Axios.get(url.toString(), config);
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

    const response = await Axios.post(url.toString(), data, config);
    if (response.data.projID === undefined) {
      throw new Error('Invalid field on project creation response');
    }
    return { projectID: response.data.projID, organizationID: organizationID, name: name, description: description };
  }

  editProject = async (token: string, projectID: number, organizationID: number, name: string, description: string) => {
    const url = new URL('/api/projects/edit', this.base);
    const data = { projID: projectID, orgID: organizationID, name: name, desc: description };
    const config = createAuthorizationConfig(token);

    await Axios.post(url.toString(), data, config);
    return { projectID: projectID, organizationID: organizationID, name: name, description: description };
  }

  deleteProject = async (token: string, projectID: number) => {
    const url = new URL('/api/projects/delete', this.base);
    const data = { projID: projectID };
    const config = createAuthorizationConfig(token);

    await Axios.post(url.toString(), data, config);
  }

  listProjects = async (token: string, organizationID: number) => {
    const url = new URL('/api/projects/list/' + organizationID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await Axios.get(url.toString(), config);
    return result.data.map((entry: any) => {
      return { projectID: entry.ProjID, organizationID: entry.OrgID, name: entry.Name, description: entry.Description };
    });
  }

  getProjectDetails = async (token: string, projectID: number) => {
    const url = new URL('/api/projects/details/' + projectID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await Axios.get(url.toString(), config);
    const entry = result.data;
    return {
      projectID: entry.ProjID,
      organizationID: entry.OrgID,
      name: entry.Name,
      description: entry.Description
    };
  }

  getRecentProjects = async (token: string) => {
    return await this.mock.getRecentProjects(token);
  }

  getNearbyFiles = async (token: string, fileID: number) => {
    return await this.mock.getNearbyFiles(token, fileID);
  }

  uploadFile = async (token: string, projectID: number, formData: FormData) => {
    const url = new URL('/api/files/upload/' + projectID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await Axios.post(url.toString(), formData, config);
    console.log(result);

    return await this.mock.uploadFile(token, projectID, formData);
  }

  downloadFile = async (token: string, fileID: number) => {
    const url = new URL('/api/files/download/' + fileID, this.base);
    const config = createAuthorizationConfig(token);
    config.responseType = 'arraybuffer';

    const result = await Axios.post(url.toString(), null, config);
    return new Blob([result.data]);
  }

  listFiles = async (token: string, projectID: number) => {
    const url = new URL('/api/files/list/' + projectID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await Axios.get(url.toString(), config);
    return result.data.map((entry: any) => {
      return {
        fileID: Number(entry.FileID),
        name: entry.Name,
      };
    });
  }

  getFileDetails = async (token: string, fileID: number) => {
    const url = new URL('/api/files/' + fileID, this.base);
    const config = createAuthorizationConfig(token);

    const result = await Axios.get(url.toString(), config);
    const entry = result.data;
    return {
      fileID: Number(entry.FileID),
      name: entry.Name,
    };
  }

  deleteFile = async (token: string, fileID: number) => {
    const url = new URL('/api/files/' + fileID, this.base);
    const config = createAuthorizationConfig(token);
    await Axios.delete(url.toString(), config);
  }

  getComments = async (token: string, fileID: number) => {
    return await this.mock.getComments(token, fileID);
  }
}

function createAuthorizationConfig(token: string): AxiosRequestConfig {
  return { headers: { Authorization: 'Bearer ' + token } };
}
