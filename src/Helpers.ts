import * as jwt from 'jsonwebtoken';
import { User } from './Models/User';
import * as emailValidator from 'email-validator';
import { Filter } from 'react-table';

export function validUsername(s: string) {
  const trimmed = s.trim();
  if (trimmed.length >= 4) {
    return { valid: true };
  } else {
    return { valid: false, message: 'Username must be at least 4 characters.' };
  }
}

export const vaildEmail = (s: string): boolean => {
  return emailValidator.validate(s);
}

export const validPassword = (s: string): boolean => {
  // TODO proper validation
  return s.trim() !== '';
}

export const readTokenPayload = (token: string): User => {
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

export function createErrorMessage(err: any, message: string) {
  if (err.response) {
    return message;
  } else if (err.request) {
    return 'Server uncreachable.';
  } else {
    return 'Unknown error occoured.';
  }
}

export function lowercaseFilterMethod(filter: Filter, row: any, column: any) {
  return row[filter.id].toString().toLowerCase().includes(filter.value.toString().toLowerCase());
}
