import { Inject } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/modules/user/entities/user.entity";
import { UserService } from "src/modules/user/user.service";

export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject('USER_SERVICE') private userService: UserService
    ){
        super();
    }

    serializeUser(user: User, done: (err: Error, user: User) => void) {
        done(null, user);
    }

    async deserializeUser(payload: User, done: Function) {
        const userDB = await this.userService.findByUsername(payload.username);
        if(!userDB) {
            return done(
                `Could not deserialize user: user with ${payload.username} couldn't be found.`,
                null
            );
        }

        done(null, userDB);
    }
}