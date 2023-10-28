import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class PKCommercial implements CanActivate {

  

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('El identificador es requerido.');
    }

    if(! (/^pk_test_[0-9a-zA-Z]{16}$/.test(token))){
        throw new UnauthorizedException('Identificador es invalido.');
    }
  
    return true;
  }
}
