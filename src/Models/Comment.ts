import { User } from "./User";

export interface Comment {
  content: string;
  published: Date;
  user: User;
}
