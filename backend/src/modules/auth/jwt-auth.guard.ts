import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any) {
        console.log('User no guard:', user); 
        if (err || !user) {
            throw err || new UnauthorizedException('Não autorizado');
        }
        return user;
    }
}
