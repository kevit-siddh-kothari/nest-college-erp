import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ROLES_KEY } from './guard.role.decorator'; // Adjust the path if necessary
import { UserRole } from 'src/components/user/entity/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const roles = this.getRoles(context);
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // console.log(user);
    // console.log(user.user.role);
    if (!user || !roles.includes(user.user.role)) {
      throw new UnauthorizedException(
        {message:'You do not have permission to access this resource'}
      );
    }

    return true;
  }

  private getRoles(context: ExecutionContext): UserRole[] | undefined {
    const handler = context.getHandler();
    const controller = context.getClass();
    const rolesHandler = Reflect.getMetadata(ROLES_KEY, handler);
    const rolesController = Reflect.getMetadata(ROLES_KEY, controller);

    return rolesHandler || rolesController;
  }
}
