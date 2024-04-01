import { Body, Controller, Get,Post, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleCreateDto } from './dto/role.dto';
import { RolesGuard } from 'src/security/guards/roles.guard';
import { Roles } from 'src/security/decorator/roles.decorator';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { ApiCreateOneRole } from './decorators/api-create-one-role.decorator';
import { ApiGetAllRoles } from './decorators/api-get-all-roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@UseGuards(AuthenticatedGuard)
// @Roles('SUPERADMIN')
@Controller('role')
export class RoleController {

    constructor(
        private readonly roleService: RoleService,
    ){}

    @ApiCreateOneRole()
    @UsePipes(new ValidationPipe({transform: true}))
    @Post('create')
    async createRole(@Body() request: RoleCreateDto) {
        const data = await this.roleService.createRole(request);

        return {[this.createRole.name]: data}
    }

    @ApiGetAllRoles()
    @Get('get')
    async findAllRoles(){
        const data = await this.roleService.indexRole();

        return {[this.findAllRoles.name]: data}
    }
}
