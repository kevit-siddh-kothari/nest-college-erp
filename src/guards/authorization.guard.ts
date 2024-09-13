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
  /**
   * Determines if the current request is allowed based on user roles.
   * @param context - The execution context for the current request.
   * @returns `true` if the user has the required role(s) or if no roles are specified; otherwise, `false`.
   * @throws UnauthorizedException if the user does not have the required role(s).
   */
  canActivate(context: ExecutionContext): boolean {
    const roles = this.getRoles(context);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !roles.includes(user.user.role)) {
      throw new UnauthorizedException({
        message: 'You do not have permission to access this resource',
      });
    }

    return true;
  }

  /**
   * Retrieves the roles metadata from the handler or controller.
   * @param context - The execution context for the current request.
   * @returns An array of roles that are allowed to access the route, or `undefined` if no roles are specified.
   */
  private getRoles(context: ExecutionContext): UserRole[] | undefined {
    const handler = context.getHandler();
    const controller = context.getClass();
    const rolesHandler = Reflect.getMetadata(ROLES_KEY, handler);
    const rolesController = Reflect.getMetadata(ROLES_KEY, controller);

    return rolesHandler || rolesController;
  }
}
