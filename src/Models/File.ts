import { User } from "./User";

export interface File {
  fileID: number;
  name: string;
  projID?: number;
  uploader?: User;
  tags?: string[];
  originalName?: string;
  uploaded?: Date;
  object?: string;
  observer?: string;
}
