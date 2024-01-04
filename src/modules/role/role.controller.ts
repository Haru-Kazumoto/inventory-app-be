import { Controller, Get, HttpStatus, Inject, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { ResponseHttp } from 'src/utils/response.http.utils';
import { Response } from 'express';
import { RoleCreateDto } from './dto/role.dto';

@Controller('role')
export class RoleController {

    constructor(
        private readonly roleService: RoleService,
        private readonly http: ResponseHttp
    ){}

    @UsePipes(new ValidationPipe({transform: true}))
    @Post('create')
    async createRole(@Res() res: Response, request: RoleCreateDto): Promise<any>{
        const data = await this.roleService.createRole(request);
        const response = this.http.createResponse(HttpStatus.OK,data);

        return this.http.sendResponse(res, response);
    }

    @Get('get')
    async findAllRoles(@Res() res: Response){
        const data = await this.roleService.indexRole();
        const response = this.http.createResponse(HttpStatus.OK,data);

        return this.http.sendResponse(res, response);
    }
}
