import { User } from "../../entities/User";

declare global {
  namespace Express {
    interface User extends User {}
    interface Request {
      user?: User;
    }
  }
}
