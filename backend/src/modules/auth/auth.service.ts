import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PasswordService } from 'src/common/services/password.service';
import { EmployeeService } from '../employee/employee.service';
import { CostumerService } from '../costumer/costumer.service';
import { JwtService } from '@nestjs/jwt';

import { Costumer } from '../costumer/schemas/costumer.schema';
import { Employee } from '../employee/schemas/employee.schema';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => CostumerService))
        private costumerService: CostumerService,
        private employeeService: EmployeeService,
        private passwordService: PasswordService,
        private jwtService: JwtService
    ) {}

    async generateToken(user: Costumer | Employee | null, expiresIn: string) {

        if(!user) {
            throw new Error('Envie o objeto do usuário');
        }

        delete (user as any).password;

        const payload = {
            sub: user._id,
            role: user.role,
            email: user.email,
            premium: user.role === 0 ? (user as Costumer).premiumTier : undefined
        };

        return {
            access_token: this.jwtService.sign(payload, { 
                expiresIn
            }),
            user: user
        };
    }

    async validateUser(email: string, password: string) {
        let user: Costumer | Employee | null = await this.costumerService.findByEmail(email);

        if (!user) user = await this.employeeService.findByEmail(email); 

        if (!user) throw new UnauthorizedException('Usuário não encontrado');

        const isMatch = await this.passwordService.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Senha incorreta');

        return user;
    }

    async login(email: string, password: string, expiresIn7d: boolean) {
        const user = await this.validateUser(email, password);
        delete (user as any).password;

        const response = await this.generateToken(user, expiresIn7d ? '7d' : '1d');

        return response;
    }

    async validateEmailAvailability(email: string): Promise<{ message: string }> {
        let user: Costumer | Employee | null = await this.costumerService.findByEmail(email);
        if (!user) user = await this.employeeService.findByEmail(email);

        if (user) {
            throw new BadRequestException('Email já existente');
        }

        return { message: 'Email disponível. Verificação enviada.' };
    }
}
