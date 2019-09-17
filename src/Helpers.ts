import * as jwt from 'jsonwebtoken';
import { User } from './Data/Backend';

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
  return { userID: result.userID, email: result.email };
}
