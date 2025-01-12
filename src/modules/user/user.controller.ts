import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/security/decorator/roles.decorator';
import { RolesGuard } from 'src/security/guards/roles.guard';
import { PageOptionsDto } from 'src/utils/pagination.utils';
import { AuthenticatedGuard } from '../../security/guards/authenticated.guard';
import { UpdateUserDto, UserCreateDto } from './dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import {
  ApiCreateOneUser,
  ApiFindAllUser,
  ApiDeleteHardUser,
  ApiDeleteSoftUser,
  ApiUpdateUser,
} from './decorator';
import { 
  Body, 
  ClassSerializerInterceptor, 
  Controller, 
  Delete, 
  Get, 
  ParseIntPipe, 
  Patch, 
  Post, 
  Put, 
  Query, 
  UseGuards, 
  UseInterceptors, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { UpdateUserPassword } from './dto/update-password-user.dto';

@ApiTags('User')
@Roles('SUPERADMIN')
@UseGuards(RolesGuard, AuthenticatedGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Find All
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiFindAllUser()
  @Get('find-all')
  public async findManyUser(@Query() pageOptionsDto: PageOptionsDto) {
    return this.userService.findMany(pageOptionsDto);
  }

  // Create
  @ApiCreateOneUser()
  @Post('create')
  public async createOneUser(@Body() body: UserCreateDto) {
    const data: User = await this.userService.createUser(body);

    return {
      [this.createOneUser.name]: data
    }
  }

  // Update
  @UsePipes(new ValidationPipe({transform: true}))
  @ApiUpdateUser()
  @Put('update')
  public async updateUser(@Query('id', ParseIntPipe) id: number,@Body() dto: UpdateUserDto) {
    const data = await this.userService.update(id, dto);

    return {[this.updateUser.name]: data}
  }

  @UsePipes(new ValidationPipe({transform: true}))
  @ApiQuery({
    name: "user-id",
    required: true,
    type: Number,
    description: "User id for update password"
  })
  @ApiBody({
    type: UpdateUserPassword,
    description: "Password update field"
  })
  @ApiOkResponse()
  @Patch('update-password')
  public async updateUserPassword(@Query('user-id', new ValidationPipe()) id: number, @Body() dto: UpdateUserPassword) {
    const data = await this.userService.updatePassword(id, dto);

    return {[this.updateUserPassword.name]: data}
  }

  // Delete Hard
  @Delete('delete-hard')
  @ApiDeleteHardUser()
  public async hardDeleteUser(@Query('id', ParseIntPipe) id: number) {
    await this.userService.hardDeleteById(id);
  }

  // Delete Soft
  @Delete('delete-soft')
  @ApiDeleteSoftUser()
  public async softDeleteUser(@Query('id', ParseIntPipe) id: number) {
    await this.userService.softDeleteById(id);
  }
}
