import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<{ user: { role: string } }>();
    if (user?.role !== 'admin') {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return true;
  }
}
