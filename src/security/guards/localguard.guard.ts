import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('local') implements CanActivate {
  constructor(){
    super();
  }

  async canActivate(context: ExecutionContext){
      const result = (await super.canActivate(context)) as boolean;
      await super.logIn(context.switchToHttp().getRequest());

      return result;
  }
}
