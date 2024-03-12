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
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, ParseIntPipe, Post, Put, Query, Request, Res, Response, UseGuards, UseInterceptors } from '@nestjs/common';

@ApiTags('User')
@UseGuards(RolesGuard)
@Roles('SUPERADMIN')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Find All
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('find-all')
  @FindAllUserDecorator()
  public async findManyUser(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return this.userService.findMany(pageOptionsDto);
  }

  // Create
  @UseInterceptors(new TransformInterceptor())
  @UseGuards(AuthenticatedGuard)
  @Post('create')
  @CreateOneUserDecorator()
  public async createOneUser(
    @Body() body: UserCreateDto,
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
  ) {
    const data: User = await this.userService.createUser(request, body);

    return response.status(200).json({
      statusCode: response.statusCode,
      message: 'User berhasil dibuat',
      data: { user: data },
    });
  }

  // Update
  @Put('update')
  @UseInterceptors(new TransformInterceptor())
  @UseGuards(AuthenticatedGuard)
  @UpdateUserDecorator()
  public async updateUser(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Res() res: ExpressResponse,
  ) {
    const instance = await this.userService.update(id, dto);
    return res.status(200).json({
      statusCode: res.statusCode,
      message: Status.SUCCESS,
      data: { user: instance },
    });
  }

  // Delete Hard
  @Delete('delete-hard')
  @UseGuards(AuthenticatedGuard)
  @DeleteHardUserDecorator()
  public async hardDeleteUser(
    @Query('id', ParseIntPipe) id: number,
  ) {
    await this.userService.hardDeleteById(id);
  }

  // Delete Soft
  @Delete('delete-soft')
  @UseGuards(AuthenticatedGuard)
  @DeleteSoftUserDecorator()
  public async softDeleteUser(
    @Query('id', ParseIntPipe) id: number,
  ) {
    await this.userService.softDeleteById(id);
  }
}
