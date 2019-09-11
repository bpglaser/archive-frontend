import Axios from "axios";

const base = new URL('http://localhost:8081');

export interface User {
  userID: string;
  username: string;
}

export async function login(email: string, password: string): Promise<{ user: User, token: string }> {
  const url = new URL('/api/login', base);
  const data = { email: email, password: password };
  const response = await Axios.post(url.toString(), data);
  return response.data;
}

export async function register(email: string, password: string): Promise<{ user: User, token: string }> {
  const url = new URL('/api/register', base);
  const data = { email: email, password: password };
  const response = await Axios.post(url.toString(), data);
  return response.data;
}
