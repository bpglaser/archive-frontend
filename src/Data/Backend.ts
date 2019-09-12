import Axios from "axios";
import { delay } from "q";

export interface User {
  userID: string;
  username: string;
}

export interface Backend {
  login: (email: string, password: string) => Promise<{ user: User, token: string }>;
  register: (email: string, password: string) => Promise<{ user: User, token: string }>;
}

export class URLBackend implements Backend {
  base: string;

  constructor(base: string) {
    this.base = base;
  }

  login = async (email: string, password: string) => {
    const url = new URL('/api/login', this.base);
    const data = { email: email, password: password };
    const response = await Axios.post(url.toString(), data);
    return response.data;
  }

  register = async (email: string, password: string) => {
    const url = new URL('/api/register', this.base);
    const data = { email: email, password: password };
    const response = await Axios.post(url.toString(), data);
    return response.data;
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
        username: email,
      },
      token: "abc123",
    };
  }

  register = async (email: string, password: string) => {
    await delay(this.sleepDuration);

    return {
      user: {
        userID: "1234567890",
        username: email,
      },
      token: "abc123",
    };
  }
}
