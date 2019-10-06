import * as jwt from 'jsonwebtoken';
import { User } from './Models/User';

export const vaildEmail = (s: string): boolean => {
  // TODO proper validation
  return s.trim() !== '';
}

export const validPassword = (s: string): boolean => {
  // TODO proper validation
  return s.trim() !== '';
}

export const readTokenPayload = (token: string): User => {
  // TODO validate token contents
  const result: any = jwt.decode(token);
  return { userID: result.userID, email: result.email, admin: result.admin };
}

export const checkIsAdmin = (token: string | null): boolean => {
  if (token === null) {
    return false;
  }

  const user = readTokenPayload(token);

  if (user.admin === undefined) {
    return false;
  }

  return user.admin;
}
