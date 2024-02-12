import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(private reflector: Reflector) { }


  private matchRoles(requiredRoles: string[], userRoles: string[]): boolean {

    if (requiredRoles.includes('all')) {
      return true
    }

    const intersection = requiredRoles.some(role => userRoles.includes(role))

    return intersection;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(META_ROLES, context.getHandler());

    if (!roles) {
      throw new UnauthorizedException('Invalid permission')
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new InternalServerErrorException('User not found (request)')
    }

    const isValid = this.matchRoles(roles, user.roles);
    if (!isValid) {
      throw new UnauthorizedException('Invalid permission')
    }

    return isValid
  }
}
