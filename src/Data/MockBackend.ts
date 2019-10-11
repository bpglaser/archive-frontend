import { delay } from 'q';
import { Article } from '../Models/Article';
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

  getArticles = async () => {
    await delay(this.sleepDuration);
    return [
      { articleID: 1, headline: 'Welcome!', author: { userID: '1', email: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.' },
      { articleID: 1, headline: 'Welcome!', author: { userID: '1', email: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.' },
      { articleID: 1, headline: 'Welcome!', author: { userID: '1', email: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.' },
      { articleID: 1, headline: 'Welcome!', author: { userID: '1', email: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.' },
      { articleID: 1, headline: 'Welcome!', author: { userID: '1', email: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.' },
    ];
  }

  getArticle = async (articleID: number) => {
    await delay(this.sleepDuration);
    return { articleID: 1, headline: 'Welcome!', author: { userID: '1', email: 'brad' }, published: new Date(), content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a dapibus lacus. Phasellus et posuere urna, ac pretium tortor. Ut venenatis fringilla nunc, at pellentesque libero vehicula porta. Sed convallis magna eget nisl pretium cursus. Etiam feugiat hendrerit maximus. Nunc eu sem ligula. In nec rutrum lorem. Nulla facilisi. Ut pellentesque congue mauris, a consectetur sapien efficitur a. Praesent pharetra, risus ut egestas dapibus, mi augue varius nisi, in accumsan risus nunc ac nisl. Suspendisse libero risus, vulputate et vulputate non, vehicula a metus. Phasellus dui arcu, tristique a dapibus vel, venenatis quis leo. Proin in sollicitudin metus. In eget.' };
  }

  createArticle = async (token: string, title: string, content: string) => {
    await delay(this.sleepDuration);
    return { articleID: 1, headline: title, author: { userID: '1', email: 'brad' }, published: new Date(), content: content };
  }

  updateArticle = async (token: string, article: Article, title: string, content: string) => {
    await delay(this.sleepDuration);
    return { articleID: article.articleID, headline: title, author: { userID: '1', email: 'brad' }, published: new Date(), content: content };
  }

  deleteArticle = async (token: string, articleID: number) => {
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

  getOrganizationDetails = async (token: string, organizationID: number) => {
    await delay(this.sleepDuration);
    return { organizationID: organizationID, name: 'foobar1', description: 'hello world' };
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

  listProjects = async (token: string, organizationID: number) => {
    await delay(this.sleepDuration);
    return [
      { projectID: 123, organizationID: organizationID, name: 'foo1', description: 'bar' },
      { projectID: 345, organizationID: organizationID, name: 'foo2', description: 'bar' },
      { projectID: 678, organizationID: organizationID, name: 'foo3', description: 'bar' },
      { projectID: 910, organizationID: organizationID, name: 'foo4', description: 'bar' },
    ];
  }

  getProjectDetails = async (token: string, projectID: number) => {
    await delay(this.sleepDuration);
    return { projectID: projectID, organizationID: 1, name: 'MyProject', description: 'Lorem ipsum description' };
  }

  getRecentProjects = async (token: string) => {
    await delay(this.sleepDuration);
    return [
      { projectID: 1, organizationID: 11, name: 'MyProject1', description: 'Lorem ipsum description' },
      { projectID: 2, organizationID: 12, name: 'MyProject2', description: 'Lorem ipsum description' },
      { projectID: 3, organizationID: 13, name: 'MyProject3', description: 'Lorem ipsum description' },
      { projectID: 4, organizationID: 14, name: 'MyProject4', description: 'Lorem ipsum description' },
    ];
  }

  getNearbyFiles = async (token: string, fileID: number) => {
    await delay(this.sleepDuration);
    return [
      { fileID: 1, name: 'foo.jpg' },
      { fileID: 2, name: 'bar.png' },
      { fileID: 3, name: 'bin.fit' },
      { fileID: 4, name: 'bazz.fits' },
    ];
  }

  uploadFile = async (token: string, projectID: number, formData: FormData) => {
    await delay(this.sleepDuration);
    return { fileID: 123, name: 'foo.jpg' };
  }

  downloadFile = async (token: string, fileID: number) => {
    await delay(this.sleepDuration);
    return new Blob();
  }

  listFiles = async (token: string, projID: number) => {
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

  deleteFile = async (token: string, fileID: number) => {
    await delay(this.sleepDuration);
  }

  getComments = async (token: string, fileID: number) => {
    await delay(this.sleepDuration);
    return [
      { content: 'Lorem ipsum comment content.', published: new Date(), user: { userID: '123', email: 'abc123@gmail.com' } },
      { content: 'Lorem ipsum comment content.', published: new Date(), user: { userID: '123', email: 'abc123@gmail.com' } },
      { content: 'Lorem ipsum comment content.', published: new Date(), user: { userID: '123', email: 'abc123@gmail.com' } },
      { content: 'Lorem ipsum comment content.', published: new Date(), user: { userID: '123', email: 'abc123@gmail.com' } },
      { content: 'Lorem ipsum comment content.', published: new Date(), user: { userID: '123', email: 'abc123@gmail.com' } },
      { content: 'Lorem ipsum comment content.', published: new Date(), user: { userID: '123', email: 'abc123@gmail.com' } },
      { content: 'Lorem ipsum comment content.', published: new Date(), user: { userID: '123', email: 'abc123@gmail.com' } },
      { content: 'Lorem ipsum comment content.', published: new Date(), user: { userID: '123', email: 'abc123@gmail.com' } },
      { content: 'Lorem ipsum comment content.', published: new Date(), user: { userID: '123', email: 'abc123@gmail.com' } },
      { content: 'Lorem ipsum comment content.', published: new Date(), user: { userID: '123', email: 'abc123@gmail.com' } },
    ];
  }
}
