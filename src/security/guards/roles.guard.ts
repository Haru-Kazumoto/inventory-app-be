import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { ROLE_KEY } from 'src/utils/constant';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    @Inject('USER_SERVICE') private userService: UserService,
    private reflector: Reflector
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [context.getClass(), context.getHandler()]);
    const request = context.switchToHttp().getRequest();

    if(request?.user){
      // console.log(request.user);
      const { id } = request.user;
      const user = await this.userService.findById(id);
      console.log(user);

      return roles.includes(user.role.name);
    }

    return false;
  }
}
