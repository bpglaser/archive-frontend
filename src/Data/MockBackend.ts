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
      project: { projectID: 1234, organizationID: 1, name: 'Example Project', description: 'Everyone is having fun lol' },
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
    return { organizationID: 1, name: 'foobar', description: 'hello world' };
  }

  editOrganization = async (token: string, organizationID: number, name: string, description: string) => {
    await delay(this.sleepDuration);
    return { organizationID: 1, name: 'foobar', description: 'hello world' };
  }

  deleteOrganization = async (token: string, organizationID: number) => {
    await delay(this.sleepDuration);
  }

  listOrganizations = async (token: string) => {
    await delay(this.sleepDuration);
    return [
      { organizationID: 1, name: 'foobar1', description: 'hello world' },
      { organizationID: 2, name: 'foobar2', description: 'hello world' },
      { organizationID: 3, name: 'foobar3', description: 'hello world' },
      { organizationID: 4, name: 'foobar4', description: 'hello world' },
    ];
  }

  createProject = async (token: string, organizationID: number, name: string, description: string) => {
    await delay(this.sleepDuration);
    return { projectID: 123, organizationID: organizationID, name: name, description: description };
  }

  editProject = async (token: string, projectID: number, organizationID: number, name: string, description: string) => {
    await delay(this.sleepDuration);
    return { projectID: projectID, organizationID: organizationID, name: name, description: description };
  }

  deleteProject = async (token: string, projectID: number) => {
    await delay(this.sleepDuration);
  }

  listProjects = async (token: string) => {
    await delay(this.sleepDuration);
    return [
      { projectID: 123, organizationID: 1, name: 'foo1', description: 'bar' },
      { projectID: 345, organizationID: 2, name: 'foo2', description: 'bar' },
      { projectID: 678, organizationID: 3, name: 'foo3', description: 'bar' },
      { projectID: 910, organizationID: 4, name: 'foo4', description: 'bar' },
    ];
  }
}
