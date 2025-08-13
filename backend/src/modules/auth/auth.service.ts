import { BadRequestException, Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/common/services/password.service';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private passwordService: PasswordService,
        private jwtService: JwtService
    ) {}

    async generateToken(user: User, expiresIn: string) {
        if (!user) {
            throw new Error('Envie o objeto do usuário');
        }

        const payload = {
            sub: user._id,
            role: user.role,
            email: user.email
        };

        return {
            access_token: this.jwtService.sign(payload, { expiresIn }),
            user
        };
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userService.findByEmail(email);

        if (!user) throw new UnauthorizedException('Usuário não encontrado');

        const isMatch = await this.passwordService.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Senha incorreta');

        return user;
    }

    async login(email: string, password: string, remember: boolean) {
        const user = await this.validateUser(email, password);
        delete (user as any).password;

        return await this.generateToken(user, remember ? '7d' : '1d');
    }

    async validateEmailAvailability(email: string): Promise<{ message: string }> {
        const user = await this.userService.findByEmail(email);

        if (user) {
            throw new BadRequestException('Email já existente');
        }

        return { message: 'Email disponível. Verificação enviada.' };
    }
}

