import Axios from 'axios';
import { readTokenPayload } from '../Helpers';
import { Backend } from './Backend';
import { MockBackend } from "./MockBackend";

export class URLBackend implements Backend {
  base: string | undefined;
  mock: MockBackend;

  constructor(base?: string) {
    this.base = base;
    this.mock = new MockBackend(0);
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

  createOrganization = async (token: string, name: string, description: string) => {
    return await this.mock.createOrganization(token, name, description);
  }

  editOrganization = async (token: string, organizationID: string, name: string, description: string) => {
    return await this.mock.editOrganization(token, organizationID, name, description);
  }

  deleteOrganization = async (token: string, organizationID: string) => {
    await this.mock.deleteOrganization(token, organizationID);
  }

  listOrganizations = async (token: string) => {
    return await this.mock.listOrganizations(token);
  }

  createProject = async (token: string, organizationID: string, name: string, description: string) => {
    return await this.mock.createProject(token, organizationID, name, description);
  }

  editProject = async (token: string, projectID: string, name: string, description: string) => {
    return await this.mock.editProject(token, projectID, name, description);
  }

  deleteProject = async (token: string, projectID: string) => {
    await this.mock.deleteProject(token, projectID);
  }

  listProjects = async (token: string) => {
    return await this.mock.listProjects(token);
  }
}

function createAuthorizationConfig(token: string) {
  return { headers: { Authorization: 'Bearer ' + token } };
}
