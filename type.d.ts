import { Roles } from "src/modules/role/roles.entity";

declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      username: string;
      email: string;
      role: Roles;
    };
  }
}