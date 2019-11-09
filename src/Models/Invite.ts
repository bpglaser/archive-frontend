import { User } from "./User";
import { Organization } from "./Organization";

export interface Invite {
  inviteID: number;
  inviter: User;
  invitee?: User;
  organization: Organization;
}
