import { CancelTokenSource } from 'axios';
import { delay } from 'q';
import { readTokenPayload } from '../Helpers';
import { Article } from '../Models/Article';
import { File } from '../Models/File';
import { Invite } from '../Models/Invite';
import { Organization } from '../Models/Organization';
import { User } from '../Models/User';
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
        userID: 1234567890,
        email: email,
        username: email,
      },
      token: "abc123",
    };
  }

  register = async (email: string, password: string, username: string) => {
    await delay(this.sleepDuration);
    return {
      user: {
        userID: 1234567890,
        email: email,
        username: username,
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

  updateUsername = async (token: string, username: string) => {
    await delay(this.sleepDuration);
    return { user: { ...readTokenPayload(token), username: username }, token: token }
  }

  getUserSuggestions = async (token: string, search: string, tokenSource: CancelTokenSource) => {
    await delay(this.sleepDuration);
    return Array.from({ length: 5 }).map((_, i) => ({ email: search + ' ' + i, userID: 1, username: search + ' ' + i }));
  }

  getInvites = async (token: string) => {
    await delay(this.sleepDuration);
    return [
      { inviteID: 1, inviter: { userID: 123, email: 'foo@bar.com', username: 'foo' }, organization: { organizationID: 456, name: 'My org', description: 'hello world' } },
      { inviteID: 1, inviter: { userID: 123, email: 'foo@bar.com', username: 'foo' }, organization: { organizationID: 456, name: 'My org', description: 'hello world' } },
      { inviteID: 1, inviter: { userID: 123, email: 'foo@bar.com', username: 'foo' }, organization: { organizationID: 456, name: 'My org', description: 'hello world' } },
      { inviteID: 1, inviter: { userID: 123, email: 'foo@bar.com', username: 'foo' }, organization: { organizationID: 456, name: 'My org', description: 'hello world' } },
      { inviteID: 1, inviter: { userID: 123, email: 'foo@bar.com', username: 'foo' }, organization: { organizationID: 456, name: 'My org', description: 'hello world' } },
    ];
  }

  getPendingInvites = async (token: string, organization: Organization) => {
    await delay(this.sleepDuration);
    return [
      { inviteID: 1, inviter: readTokenPayload(token), invitee: { userID: 1, email: 'brad1@foo.com', username: 'foobar' }, organization: organization },
      { inviteID: 2, inviter: readTokenPayload(token), invitee: { userID: 2, email: 'brad2@foo.com', username: 'foobar' }, organization: organization },
      { inviteID: 3, inviter: readTokenPayload(token), invitee: { userID: 3, email: 'brad3@foo.com', username: 'foobar' }, organization: organization },
      { inviteID: 4, inviter: readTokenPayload(token), invitee: { userID: 4, email: 'brad4@foo.com', username: 'foobar' }, organization: organization },
      { inviteID: 5, inviter: readTokenPayload(token), invitee: { userID: 5, email: 'brad5@foo.com', username: 'foobar' }, organization: organization },
    ];
  }

  acceptInvite = async (token: string, invite: Invite) => {
    await delay(this.sleepDuration);
  }

  cancelInvite = async (token: string, invite: Invite) => {
    await delay(this.sleepDuration);
  }

  declineInvite = async (token: string, invite: Invite) => {
    await delay(this.sleepDuration);
  }

  getArticles = async () => {
    await delay(this.sleepDuration);
    return [
      { articleID: 1, headline: 'Welcome!', author: { userID: 1, email: 'brad', username: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.', snippet: 'foo' },
      { articleID: 1, headline: 'Welcome!', author: { userID: 1, email: 'brad', username: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.', snippet: 'foo' },
      { articleID: 1, headline: 'Welcome!', author: { userID: 1, email: 'brad', username: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.', snippet: 'foo' },
      { articleID: 1, headline: 'Welcome!', author: { userID: 1, email: 'brad', username: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.', snippet: 'foo' },
      { articleID: 1, headline: 'Welcome!', author: { userID: 1, email: 'brad', username: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.', snippet: 'foo' },
    ];
  }

  getArticle = async (articleID: number) => {
    await delay(this.sleepDuration);
    return { articleID: 1, headline: 'Welcome!', author: { userID: 1, email: 'brad', username: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.', snippet: 'foo' };
  }

  createArticle = async (token: string, title: string, content: string) => {
    await delay(this.sleepDuration);
    return { articleID: 1, headline: title, author: { userID: 1, email: 'brad', username: 'brad' }, published: new Date(), content: content, snippet: content.slice(0, 100) };
  }

  updateArticle = async (token: string, article: Article, title: string, content: string) => {
    await delay(this.sleepDuration);
    return { articleID: article.articleID, headline: title, author: { userID: 1, email: 'brad', username: 'brad' }, published: new Date(), content: content, snippet: content.slice(0, 100) };
  }

  deleteArticle = async (token: string, articleID: number) => {
    await delay(this.sleepDuration);
  }

  createOrganization = async (token: string, name: string, description: string, admins: number[]) => {
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

  getOrganizationDetails = async (token: string, organizationID: number) => {
    await delay(this.sleepDuration);
    return { organizationID: organizationID, name: 'foobar1', description: 'hello world' };
  }

  getOrganizationUsers = async (token: string, organization: Organization) => {
    await delay(this.sleepDuration);
    return [
      { user: { userID: 1, email: 'foo0@gmail.com', username: 'foo0' }, isAdmin: true },
      { user: { userID: 2, email: 'foo1@gmail.com', username: 'foo1' }, isAdmin: false },
      { user: { userID: 3, email: 'foo2@gmail.com', username: 'foo2' }, isAdmin: false },
      { user: { userID: 4, email: 'foo3@gmail.com', username: 'foo3' }, isAdmin: true },
    ];
  }

  setOrganizationAdmin = async (token: string, organization: Organization, user: User, isAdmin: boolean) => {
    await delay(this.sleepDuration);
  }

  kickUserFromOrganization = async (token: string, organization: Organization, user: User) => {
    await delay(this.sleepDuration);
  }

  inviteUserToOrganization = async (token: string, organization: Organization, user: User) => {
    await delay(this.sleepDuration);
    return { inviteID: 1, inviter: readTokenPayload(token), invitee: { userID: 1, email: 'brad1@foo.com', username: 'brad1' }, organization: organization };
  }

  createProject = async (token: string, organizationID: number, name: string, description: string, isPublic: boolean) => {
    await delay(this.sleepDuration);
    return { projectID: 123, organizationID: organizationID, name: name, description: description, owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } };
  }

  editProject = async (token: string, projectID: number, organizationID: number, name: string, description: string, isPublic: boolean) => {
    await delay(this.sleepDuration);
    return { projectID: projectID, organizationID: organizationID, name: name, description: description, owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } };
  }

  deleteProject = async (token: string, projectID: number) => {
    await delay(this.sleepDuration);
  }

  listProjects = async (token: string, organizationID: number) => {
    await delay(this.sleepDuration);
    return [
      { projectID: 123, organizationID: organizationID, name: 'foo1', description: 'bar', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
      { projectID: 345, organizationID: organizationID, name: 'foo2', description: 'bar', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
      { projectID: 678, organizationID: organizationID, name: 'foo3', description: 'bar', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
      { projectID: 910, organizationID: organizationID, name: 'foo4', description: 'bar', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
    ];
  }

  getProjectDetails = async (token: string | null, projectID: number) => {
    await delay(this.sleepDuration);
    return { projectID: projectID, organizationID: 1, name: 'MyProject', description: 'Lorem ipsum description', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } };
  }

  getRecentProjects = async (token: string) => {
    await delay(this.sleepDuration);
    return [
      { projectID: 1, organizationID: 11, name: 'MyProject1', description: 'Lorem ipsum description', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
      { projectID: 2, organizationID: 12, name: 'MyProject2', description: 'Lorem ipsum description', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
      { projectID: 3, organizationID: 13, name: 'MyProject3', description: 'Lorem ipsum description', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
      { projectID: 4, organizationID: 14, name: 'MyProject4', description: 'Lorem ipsum description', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
    ];
  }

  getPublicProjects = async () => {
    await delay(this.sleepDuration);
    return [
      { projectID: 1, organizationID: 11, name: 'MyProject1', description: 'Lorem ipsum description', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
      { projectID: 2, organizationID: 12, name: 'MyProject2', description: 'Lorem ipsum description', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
      { projectID: 3, organizationID: 13, name: 'MyProject3', description: 'Lorem ipsum description', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
      { projectID: 4, organizationID: 14, name: 'MyProject4', description: 'Lorem ipsum description', owner: { userID: 123, email: 'foo@bar.com', username: 'foobar' } },
    ];
  }

  getNearbyFiles = async (token: string, fileID: number) => {
    await delay(this.sleepDuration);
    return [
      { distance: 1, file: { fileID: 1, name: 'foo.jpg' } },
      { distance: 1, file: { fileID: 2, name: 'bar.png' } },
      { distance: 1, file: { fileID: 3, name: 'bin.fit' } },
      { distance: 1, file: { fileID: 4, name: 'bazz.fits' } },
    ];
  }

  uploadFile = async (token: string, projectID: number, formData: FormData) => {
    await delay(this.sleepDuration);
    return { fileID: 123, name: 'foo.jpg' };
  }

  downloadFile = async (token: string, fileID: number, extension?: string) => {
    await delay(this.sleepDuration);
    return new Blob();
  }

  listFiles = async (token: string | null, projID: number) => {
    await delay(this.sleepDuration);
    return [
      { fileID: 1, name: 'foo.jpg' },
      { fileID: 2, name: 'bar.png' },
      { fileID: 3, name: 'bin.fit' },
      { fileID: 4, name: 'bazz.fits' },
    ];
  }

  getFileDetails = async (token: string, fileID: number) => {
    await delay(this.sleepDuration);
    return { fileID: fileID, name: 'foo.jpg' };
  }

  updateFile = async (token: string, file: File, name: string) => {
    await delay(this.sleepDuration);
    return { ...file, name: name };
  }

  deleteFile = async (token: string, fileID: number) => {
    await delay(this.sleepDuration);
  }

  submitComment = async (token: string, fileID: number, content: string) => {
    await delay(this.sleepDuration);
    return { commentID: 1, content: 'Lorem ipsum comment content.', published: new Date(), updated: null, user: { userID: 123, email: 'abc123@gmail.com', username: 'abc123' } };
  }

  getComments = async (token: string, fileID: number) => {
    await delay(this.sleepDuration);
    return [
      { commentID: 1, content: 'Lorem ipsum comment content.', published: new Date(), updated: null, user: { userID: 123, email: 'abc123@gmail.com', username: 'abc123' } },
      { commentID: 2, content: 'Lorem ipsum comment content.', published: new Date(), updated: null, user: { userID: 123, email: 'abc123@gmail.com', username: 'abc123' } },
      { commentID: 3, content: 'Lorem ipsum comment content.', published: new Date(), updated: null, user: { userID: 123, email: 'abc123@gmail.com', username: 'abc123' } },
      { commentID: 4, content: 'Lorem ipsum comment content.', published: new Date(), updated: null, user: { userID: 123, email: 'abc123@gmail.com', username: 'abc123' } },
      { commentID: 5, content: 'Lorem ipsum comment content.', published: new Date(), updated: null, user: { userID: 123, email: 'abc123@gmail.com', username: 'abc123' } },
      { commentID: 6, content: 'Lorem ipsum comment content.', published: new Date(), updated: null, user: { userID: 123, email: 'abc123@gmail.com', username: 'abc123' } },
      { commentID: 7, content: 'Lorem ipsum comment content.', published: new Date(), updated: null, user: { userID: 123, email: 'abc123@gmail.com', username: 'abc123' } },
      { commentID: 8, content: 'Lorem ipsum comment content.', published: new Date(), updated: null, user: { userID: 123, email: 'abc123@gmail.com', username: 'abc123' } },
      { commentID: 9, content: 'Lorem ipsum comment content.', published: new Date(), updated: null, user: { userID: 123, email: 'abc123@gmail.com', username: 'abc123' } },
    ];
  }

  editComment = async (token: string, commentID: number, content: string) => {
    await delay(this.sleepDuration);
    return { commentID: commentID, content: content, published: new Date(), updated: new Date(), user: { userID: 123, email: 'abc123@gmail.com', username: 'abc123' } };
  }

  deleteComment = async (token: string, commentID: number) => {
    await delay(this.sleepDuration);
  }

  getTags = async (token: string | null, fileID: number) => {
    await delay(this.sleepDuration);
    return ['foo', 'bar', 'bin', 'bazz'];
  }

  addTag = async (token: string, fileID: number, tag: string) => {
    await delay(this.sleepDuration);
  }

  deleteTag = async (token: string, fileID: number, tag: string) => {
    await delay(this.sleepDuration);
  }

  getMetadata = async (token: string, fileID: number) => {
    await delay(this.sleepDuration);
    return {
      'foo': 'bar',
      'bin': 'bazz',
    };
  }
}
