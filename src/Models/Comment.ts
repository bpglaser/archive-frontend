import { User } from "./User";

export interface Comment {
  commentID: number;
  content: string;
  published: Date;
  updated: Date | null;
  user: User;
}
