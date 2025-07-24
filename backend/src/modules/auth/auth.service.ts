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

    async validateUser(email: string, password: string) {
        let user: Costumer | Employee | null = await this.costumerService.findByEmail(email);

        if (!user) user = await this.employeeService.findByEmail(email); 

        if (!user) throw new UnauthorizedException('Usuário não encontrado');

        const isMatch = await this.passwordService.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Senha incorreta');

        return user;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        delete (user as any).password;

        const token = await this.jwtService.signAsync(user);

        return {
            access_token: token,
            user: user
        };
    }

    async validateEmailAvailability(email: string): Promise<{ message: string }> {
        let user: Costumer | Employee | null = await this.costumerService.findByEmail(email);
        if (!user) user = await this.employeeService.findByEmail(email);

        if (user) {
            throw new BadRequestException('Email já existente');
        }

        return { message: 'Email disponível. Verificação enviada.' };
    }

    async generateToken(user: Costumer | Employee | null) {

        if(!user) {
            throw new Error('Envie o objeto do usuário');
        }

        const userObj = JSON.parse(JSON.stringify(user))
        const { password, ...payload } = userObj;
        console.log('USER NO PASSWORD: ', userObj)

        return this.jwtService.sign(payload);
    }
}
