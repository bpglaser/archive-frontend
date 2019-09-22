import Axios from 'axios';
import { delay } from 'q';
import { readTokenPayload } from '../Helpers';
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

export class MockBackend implements Backend {
  sleepDuration: number;

  constructor(sleepDuration: number) {
    this.sleepDuration = sleepDuration;
  }

  login = async (email: string, password: string) => {
    await delay(this.sleepDuration);

    return {
      user: {
        userID: "1234567890",
        email: email,
      },
      token: "abc123",
    };
  }

  register = async (email: string, password: string) => {
    await delay(this.sleepDuration);

    return {
      user: {
        userID: "1234567890",
        email: email,
      },
      token: "abc123",
    };
  }

  logout = async (token: string) => {
    await delay(this.sleepDuration);
  }

  updatePassword = async (token: string, oldPassword: string, newPassword: string) => {
    await delay(this.sleepDuration);
  }

  invite = async (token: string, key: string) => {
    await delay(this.sleepDuration);
    return {
      inviter: { userID: 'brad-iD', email: 'brad@foo.com' },
      project: { id: 1234, title: 'Example Project', description: 'Everyone is having fun lol', imageCount: 1 },
    };
  }

  acceptInvite = async (token: string, key: string) => {
    await delay(this.sleepDuration);
  }

  declineInvite = async (token: string, key: string) => {
    await delay(this.sleepDuration);
  }

  createOrganization = async (token: string, name: string, description: string) => {
    await delay(this.sleepDuration);
    return {};
  }

  editOrganization = async (token: string, organizationID: string, name: string, description: string) => {
    await delay(this.sleepDuration);
    return {};
  }

  deleteOrganization = async (token: string, organizationID: string) => {
    await delay(this.sleepDuration);
  }

  listOrganizations = async (token: string) => {
    await delay(this.sleepDuration);
    return [];
  }

  createProject = async (token: string, organizationID: string, name: string, description: string) => {
    await delay(this.sleepDuration);
    return { id: 123, title: 'foo', description: 'bar' };
  }

  editProject = async (token: string, projectID: string, name: string, description: string) => {
    await delay(this.sleepDuration);
    return { id: 123, title: 'foo', description: 'bar' };
  }

  deleteProject = async (token: string, projectID: string) => {
    await delay(this.sleepDuration);
  }

  listProjects = async (token: string) => {
    await delay(this.sleepDuration);
    return [];
  }
}

function createAuthorizationConfig(token: string) {
  return { headers: { Authorization: 'Bearer ' + token } };
}
