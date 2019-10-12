import { User } from "./User";

export interface Article {
  articleID: number;
  headline: string;
  author: User;
  content: string;
  snippet?: string;
  published: Date;
  updated?: Date;
}
