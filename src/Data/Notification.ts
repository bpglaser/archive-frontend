import { User } from "../Models/User";
import { Organization } from "../Models/Organization";

interface Invite {
  inviter: User;
  organization: Organization;
}

export default interface Notification {
  content: Invite;
}
