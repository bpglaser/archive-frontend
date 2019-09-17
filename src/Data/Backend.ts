import Axios from 'axios';
import { delay } from 'q';
import { readTokenPayload } from '../Helpers';
import { OK } from 'http-status-codes';

export interface User {
  userID: string;
  email: string;
}

export interface Backend {
  login: (email: string, password: string) => Promise<{ user: User, token: string }>;
  register: (email: string, password: string) => Promise<{ user: User, token: string }>;
  logout: (token: string) => Promise<boolean>;
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
    const data = { token: token };
    const response = await Axios.post(url.toString(), data);
    return response.status === OK;
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
    return true;
  }
}
