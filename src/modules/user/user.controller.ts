import { 
    Body, 
    Controller, 
    Get, 
    HttpStatus, 
    Res, 
    Query, 
    ParseIntPipe,
    Put,
    Delete,
    UseGuards,
    Post,
    Request,
    Response,
    UseInterceptors,
    ClassSerializerInterceptor
} from '@nestjs/common';
import { UserCreateDto } from './dto/user.dto';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { AuthenticatedGuard } from '../../security/guards/authenticated.guard';
import { RolesGuard } from 'src/security/guards/roles.guard';
import { Roles } from 'src/security/decorator/roles.decorator';
import { Request as ExpressRequest, Response as ExpressResponse} from 'express';
import { ApiBadRequestResponse, ApiBody, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { Status } from 'src/enums/response.enum';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User')
@UseGuards(RolesGuard)
@Roles('SUPERADMIN')
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @UseGuards(AuthenticatedGuard)
    @Get('find-all')
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

    @UseInterceptors(new TransformInterceptor())
    @UseGuards(AuthenticatedGuard)
    @Post('create')
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
            data: {user: data}
        });
    }

    @UseInterceptors(new TransformInterceptor())
    @Put('update')
    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({
        description: "Success to update one record of user",
        schema: {
            type: "object",
            properties: {
                statusCode: {type: "number", example: 200},
                message: {type: "string", example: "SUCCESS"},
                data: {type: "object", example: {user: {}}}
            }
        }
    })
    @ApiBadRequestResponse({
        description: "There is something bad happend to request",
        schema: {
            type: "object",
            properties: {
                statusCode: {type: "number", example: 400},
                message: {type: "string", example: "Not valid type"},
                data: {type: "object", example: null}
            }
        }
    })
    @ApiInternalServerErrorResponse({
        description: "Internal server error response",
        schema: {
            type: "object",
            properties: {
                statusCode: {type: "number", example: 500},
                message: {type: "string", example: "Internal server error"}
            }
        }
    })
    @ApiBody({type: UserCreateDto, description: "DTO Request for update", required: true})
    @ApiQuery({
        name: "id",
        description: "Id user for update",
        type: Number,
        required: true
    })
    public async updateUser(
        @Query('id', ParseIntPipe) id: number,
        @Body() dto: UserCreateDto,
        @Res() res: ExpressResponse
    ){
        const instance = await this.userService.update(id, dto);
        return res.status(200).json({
            statusCode: res.statusCode,
            message: Status.SUCCESS,
            data: {user: instance}
        })
    }

    @Delete('delete')
    @UseGuards(AuthenticatedGuard)
    @ApiQuery({
        name: "id",
        description: "Id user for delete",
        type: Number,
        required: true
    })
    @ApiBadRequestResponse({
        description: "Bad request response",
        schema: {
            type: "object",
            properties:{
                statusCode: {type: "number", example: 400},
                message: {type: "string", example: "Id user tidak ditemukan"}
            },
        }
    })
    public async deleteUser(@Query('id', ParseIntPipe) id: number){
        await this.userService.delete(id);
    }
} 