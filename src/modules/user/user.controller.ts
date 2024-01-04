import { 
    Body, 
    Controller, 
    Get, 
    HttpStatus, 
    Res, 
    Query, 
    ParseIntPipe,
    Req,
    DefaultValuePipe,
    Put,
    Delete,
    Inject,
    UseGuards,
    Session,
    SetMetadata
} from '@nestjs/common';
import { UserCreateDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { ResponseHttp } from 'src/utils/response.http.utils';
import { User } from './user.entity';
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { AuthenticatedGuard } from '../../security/guards/authenticated.guard';
import { RolesGuard } from 'src/security/guards/roles.guard';
import { Roles } from 'src/security/decorator/roles.decorator';
import { SessionData as ExpressSession } from 'express-session';

@Roles('ADMIN','SUPERADMIN')
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly response: ResponseHttp
    ){}

    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Get('index')
    public async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('size', new DefaultValuePipe(5), ParseIntPipe) limit: number,
        @Req() request: Request
    ): Promise<Pagination<User>>{
        const options: IPaginationOptions = {
            limit: limit, 
            page: page, 
            route: request.url
        };

        return await this.userService.index(options);
    }

    // @UseGuards(AuthenticatedGuard, RolesGuard)
    @SetMetadata('isPublic', true)
    @Get('find-by-username')
    public async findByUsername(@Query('username') username: string){
        return this.userService.findByUsername(username);
    }

    @Put('update')
    @UseGuards(AuthenticatedGuard)
    public async updateUser(@Query('id', ParseIntPipe) id: number,@Body() dto: UserCreateDto,@Res() res: Response){
        const instance = await this.userService.update(id, dto);
        const response = this.response.createResponse(HttpStatus.OK, instance);

        return this.response.sendResponse(res, response);
    }

    @Delete('delete')
    @UseGuards(AuthenticatedGuard)
    public async deleteUser(@Query('id', ParseIntPipe) id: number){
        await this.userService.delete(id);
    }

    @Get('get-user')
    getUser(@Req() req: Request){
        console.log(req.user);
    }

    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Get('hello')
    getHello(@Session() session: ExpressSession): string{
        return `Congrat's now you've been authenticated by your own role`;
    }
} 
