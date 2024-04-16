import { Request } from "express";
import { UserCreateDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";
import { UpdateUserPassword } from "./dto/update-password-user.dto";

export interface IUserService {
    createUser(body: UserCreateDto): Promise<User>;
    findMany(pageOptions: PageOptionsDto): Promise<PageDto<User>>;
    update(id: number, body: UserCreateDto): Promise<User>;
    updatePassword(id: number, newPassword: UpdateUserPassword): Promise<User>;
    hardDeleteById(id: number): any;
    softDeleteById(id: number): any;
    findByUsername(username: string): Promise<User>;
    findById(id: number): Promise<User>;
}