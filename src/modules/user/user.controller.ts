import * as NestCommon from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { Status } from 'src/enums/response.enum';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { Roles } from 'src/security/decorator/roles.decorator';
import { RolesGuard } from 'src/security/guards/roles.guard';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { AuthenticatedGuard } from '../../security/guards/authenticated.guard';
import {
  CreateOneUserDecorator,
  DeleteHardUserDecorator,
  DeleteSoftUserDecorator,
  FindAllUserDecorator,
  UpdateUserDecorator,
} from './decorator';
import { UpdateUserDto, UserCreateDto } from './dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@NestCommon.UseGuards(RolesGuard)
@Roles('SUPERADMIN')
@NestCommon.Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Find All
  @NestCommon.UseGuards(AuthenticatedGuard)
  @NestCommon.UseInterceptors(NestCommon.ClassSerializerInterceptor)
  @NestCommon.Get('find-all')
  @FindAllUserDecorator()
  public async findManyUser(
    @NestCommon.Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return this.userService.findMany(pageOptionsDto);
  }

  // Create
  @NestCommon.UseInterceptors(new TransformInterceptor())
  @NestCommon.UseGuards(AuthenticatedGuard)
  @NestCommon.Post('create')
  @CreateOneUserDecorator()
  public async createOneUser(
    @NestCommon.Body() body: UserCreateDto,
    @NestCommon.Request() request: ExpressRequest,
    @NestCommon.Response() response: ExpressResponse,
  ) {
    const data: User = await this.userService.createUser(request, body);

    return response.status(200).json({
      statusCode: response.statusCode,
      message: 'User berhasil dibuat',
      data: { user: data },
    });
  }

  // Update
  @NestCommon.Put('update')
  @NestCommon.UseInterceptors(new TransformInterceptor())
  @NestCommon.UseGuards(AuthenticatedGuard)
  @UpdateUserDecorator()
  public async updateUser(
    @NestCommon.Query('id', NestCommon.ParseIntPipe) id: number,
    @NestCommon.Body() dto: UpdateUserDto,
    @NestCommon.Res() res: ExpressResponse,
  ) {
    const instance = await this.userService.update(id, dto);
    return res.status(200).json({
      statusCode: res.statusCode,
      message: Status.SUCCESS,
      data: { user: instance },
    });
  }

  // Delete Hard
  @NestCommon.Delete('delete-hard')
  @NestCommon.UseGuards(AuthenticatedGuard)
  @DeleteHardUserDecorator()
  public async hardDeleteUser(
    @NestCommon.Query('id', NestCommon.ParseIntPipe) id: number,
  ) {
    await this.userService.hardDeleteById(id);
  }

  // Delete Soft
  @NestCommon.Delete('delete-soft')
  @NestCommon.UseGuards(AuthenticatedGuard)
  @DeleteSoftUserDecorator()
  public async softDeleteUser(
    @NestCommon.Query('id', NestCommon.ParseIntPipe) id: number,
  ) {
    await this.userService.softDeleteById(id);
  }
}
