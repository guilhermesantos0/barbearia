import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context) {
        if (err || !user) {
            throw new UnauthorizedException('Usuário não autorizado ou token inválido');
        }

        const req = context.switchToHttp().getRequest();
        const token = req.cookies['access_token'];
        console.log('[JWT Guard] - Token no Cookie: ', token)

        if (!token) throw new UnauthorizedException('Token não encontrado');

        return user;
    }
}
