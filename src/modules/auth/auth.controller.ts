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
    ValidationPipe 
} from '@nestjs/common';
import { AuthenticatedGuard } from '../../security/guards/authenticated.guard';
import { LocalGuard } from '../../security/guards/localguard.guard';
import { AuthService } from './auth.service';
import { Request as ExpressRequest} from 'express';
import { AuthRequest } from './auth.dto';
import { Session as ExpressSession } from 'express-session';
import { User } from '../user/user.entity';
import { RolesGuard } from 'src/security/guards/roles.guard';
import { Roles } from 'src/security/decorator/roles.decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}

    @SetMetadata('isPublic', true)
    @UseGuards(LocalGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Req() request: ExpressRequest, @Session() session: ExpressSession){
        console.log(session);
        return this.authService.login(request);
    }

    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() request: AuthRequest, @Req() req: ExpressRequest){
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

    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles('ADMIN_AKL')
    @Get('get-session')
    async getSession(@Session() session: any): Promise<User>{
        return session;
    }

    @UseGuards(AuthenticatedGuard)
    @HttpCode(HttpStatus.OK)
    @Get('hello')
    hello(): string{
        return "Yey, u've already authenticated by passport session authentication!";
    }
}
