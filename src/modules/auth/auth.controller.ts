import { 
    Body, 
    Controller, 
    Get, 
    HttpCode, 
    HttpException, 
    HttpStatus, 
    Inject, 
    Post, 
    Req, 
    Session,
    SetMetadata, 
    UseGuards, 
    UsePipes, 
    ValidationPipe,
    Res
} from '@nestjs/common';
import { AuthenticatedGuard } from '../../security/guards/authenticated.guard';
import { LocalGuard } from '../../security/guards/localguard.guard';
import { AuthService } from './auth.service';
import { Request as ExpressRequest, Response as ExpressResponse} from 'express';
import { AuthLogin, AuthRequest } from './auth.dto';
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @SetMetadata('isPublic', true)
    @UseGuards(LocalGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOkResponse({
        description: "Login success",
        schema: {
            type: "object",
            properties: {
                statusCode: {type: "number", example: 202},
                message: {type: "string", example: "Hello Admin TJKT"}
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized or invalid credentials",
        schema: {
            type: "object",
            properties: {
                statusCode: {type: "number", example: 401},
                message: {type: "string", example: "Unauthorized"}
            }
        }
    })
    @ApiBody({type: AuthLogin, description: "Login credential requirements field"})
    async login(@Req() request: ExpressRequest){
        return await this.authService.login(request);
    }

    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe())
    @ApiBody({type: AuthRequest, description: "Request requirements for registration user"})
    @Post('register')
    async register(@Body() request: AuthRequest){
        return await this.authService.register(request);
    }

    @UseGuards(AuthenticatedGuard)
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Req() request: ExpressRequest){
        const isLogoutError = await new Promise((resolve) => {
            request.logOut({keepSessionInfo: false}, (error: Error) => {
                resolve(error)
            })
        });

        if(isLogoutError){
            console.error(isLogoutError);
            throw new HttpException("Cannot logout due to error", 500);
        };

        return this.authService.logout(request);
    }

    @UseGuards(AuthenticatedGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: "User Session",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: { type: "string", example: "OK" },
                data: {
                    type: "object",
                    properties: {
                        user: {
                            type: "object",
                            properties: {
                                id: { type: "number", example: 1 },
                                name: { type: "string", example: "admin" },
                                username: { type: "string", example: "admin" },
                                role_id: { type: "number", example: 5 },
                                role: {
                                    type: "object",
                                    properties: {
                                        id: { type: "number", example: 5 },
                                        name: { type: "string", example: "SUPERADMIN" },
                                        major: { type: "string", example: "SUPERADMIN" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }
    })
    @Get('get-session')
    async getSession() {
        const data = await this.authService.getSession();
        
        return {
            [this.getSession.name]: data
        }
    }
}
