import { Project } from './Project';
import { User } from './User';

export interface InviteDetails {
  inviter: User;
  project: Project;
}
