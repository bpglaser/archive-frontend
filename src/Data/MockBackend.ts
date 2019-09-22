import { delay } from 'q';
import { Backend } from './Backend';

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
    return [{}, {}, {}, {}];
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
    return [
      { id: 123, title: 'foo', description: 'bar' },
      { id: 123, title: 'foo', description: 'bar' },
      { id: 123, title: 'foo', description: 'bar' },
      { id: 123, title: 'foo', description: 'bar' },
    ];
  }
}
