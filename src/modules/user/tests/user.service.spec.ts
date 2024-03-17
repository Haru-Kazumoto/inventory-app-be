import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user.service";
import { UserRepository } from "../repository/user.repository";
import { RoleModule } from "../../role/role.module";
import { RoleRepository } from "../../role/repository/role.repository";
import { NotificationService } from "../../notification/notification.service";
import { AuthService } from "../../auth/auth.service";
import { UserUtils } from "../../../utils/modules_utils/user.utils";
import { NotificationRepository } from "../../notification/repository/notification.repository";

describe('UserService', () => {
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            // imports: [RoleModule],
            providers: [
                UserService, 
                UserRepository, 
                RoleRepository,
                NotificationService,
                NotificationRepository,
                AuthService,
                UserUtils,
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    it("should be defined", () => {
        expect(userService).toBeDefined();
    });
})