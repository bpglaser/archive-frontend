import * as jwt from 'jsonwebtoken';
import { User } from './Models/User';

export function validUsername(s: string): boolean {
  // TODO proper validation
  return s.trim() !== '';
}

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
  return { userID: result.userID, email: result.email, admin: result.admin, username: result.username };
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

export function registerEscHandler(func: () => void) {
  const escapeKeyCode = 27;
  document.onkeyup = (event) => {
    if (event.keyCode === escapeKeyCode) {
      func();
    }
  };
}

export function unregisterEscHandler() {
  document.onkeyup = null;
}

export function isAdmin(token: string | null | undefined) {
  if (!token) {
    return false;
  }

  const user = readTokenPayload(token);

  if (user.admin === undefined) {
    return false;
  } else {
    return user.admin;
  }
}
