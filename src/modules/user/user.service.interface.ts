import { UserCreateDto } from "./dto/user.dto";
import { User } from "./entity/user.entity";
import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";

export interface IUserService {
    createUser(body: UserCreateDto): Promise<User>;
    findMany(pageOptions: PageOptionsDto): Promise<PageDto<User>>;
    update(id: number, body: UserCreateDto): Promise<User>;
    delete(id: number): any;
    findByUsername(username: string): Promise<User>;
    findById(id: number): Promise<User>;
}