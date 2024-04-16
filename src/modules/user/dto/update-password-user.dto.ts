import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./createuser.dto";

export class UpdateUserPassword extends PickType(CreateUserDto, ['password'] as const){}