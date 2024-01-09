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
    SetMetadata,
    Post,
    Request,
    Response,
    UseInterceptors,
    ClassSerializerInterceptor
} from '@nestjs/common';
import { UserCreateDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ResponseHttp } from 'src/utils/response.http.utils';
import { User } from './entity/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { AuthenticatedGuard } from '../../security/guards/authenticated.guard';
import { RolesGuard } from 'src/security/guards/roles.guard';
import { Roles } from 'src/security/decorator/roles.decorator';
import { SessionData as ExpressSession } from 'express-session';
import { Request as ExpressRequest, Response as ExpressResponse} from 'express';
import { ApiBadRequestResponse, ApiBody, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User')
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

    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Get('find-all')
    @Roles('SUPERADMIN')
    @ApiOkResponse({
        description: "Success get all users",
        schema: {
            type: "object",
            properties: {
                statusCode: {type: "number", example: 200},
                message: {type: "string", example: "OK"},
                data: {type: "array", example: {users: [{}]}}
            }
        }
    })
    @ApiInternalServerErrorResponse({
        description: "Internal server error",
        schema: {
            type: "object",
            properties: {
                statusCode: {type: "number", example: 500},
                message: {type: "string", example: "Internal server error"}
            }
        }
    })
    @ApiPaginatedResponse(User)
    public async findManyUser(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<User>>{
        return this.userService.findMany(pageOptionsDto);
    }

    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles('SUPERADMIN')
    @Post('create-user')
    @ApiOkResponse({
            description: "Record has successfully created",
            schema: {
                type: "object",
                properties: {
                    status:{type: "number", example: 200},
                    message:{type: "string", example: "OK"},
                    data: {type: "object", example: {user:{}}}
                }
            }
    })
    @ApiBadRequestResponse({
            description: "Bad Request",
            schema: {
                type: "object",
                properties: {
                    error: {type: "array", example:["username cannot be empty","email pattern not valid"]}
                }
            }
    })
    @ApiForbiddenResponse({
        description: "Forbidden resource or ability",
        schema: {
            type: "object",
            properties: {
                statusCode: {type: "number",example: 401},
                message: {type: "string", example: "Not Authenticated"},
                error: {type: "string", example: "Forbidden"}
            }
        }
    })
    @ApiInternalServerErrorResponse({
        description: "Internal Server Error",
        schema: {
            type: "object",
            properties: {
                message: {type: "string", example: "Internal server error"},
                status: {type: "number", example: 500}
            }
        }
    })
    @ApiBody({type: UserCreateDto,description:"DTO Structure Response"})
    public async createOneUser(@Body() body: UserCreateDto, @Request() request: ExpressRequest, @Response() response: ExpressResponse){
        const data: User = await this.userService.createUser(body);

        return response.status(200).json({  
            statusCode: response.statusCode,
            message: "User berhasil dibuat",
            data: {
                user: data
            }
        });
    }

    // @UseGuards(AuthenticatedGuard, RolesGuard)
    @SetMetadata('isPublic', true)
    @Get('find-by-username')
    public async findByUsername(@Query('username') username: string){
        return this.userService.findByUsername(username);
    }

    @Put('update')
    @UseGuards(AuthenticatedGuard)
    public async updateUser(@Query('id', ParseIntPipe) id: number,@Body() dto: UserCreateDto,@Res() res: ExpressResponse){
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
    getUser(@Req() req: ExpressRequest){
        console.log(req.user);
    }

    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Get('hello')
    getHello(@Session() session: ExpressSession): string{
        return `Congrat's now you've been authenticated by your own role`;
    }
} 
