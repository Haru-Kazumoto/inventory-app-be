import { Test, TestingModule } from "@nestjs/testing";
import { UserRepository } from "../repository/user.repository"
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepository,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository
                },
            ],
        }).compile();

        userRepository = module.get<UserRepository>(UserRepository);
    });

    it("Should find user by role", async () => {
        const role = "ADMIN";
        const userMock = new User();

        jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValue({
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockReturnValue(Promise.resolve(userMock)),
        } as any);

        const result = await userRepository.findUserByRole(role);

        expect(result).toEqual(userMock);
    });
})