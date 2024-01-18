import { Roles } from "src/modules/role/entities/roles.entity";
import { User } from "src/modules/user/entities/user.entity";

declare module 'express-session' {
  interface SessionData {
    user: User
  }
}

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      username: string;
      role_id: number;
      role: Roles
    }
  }
}