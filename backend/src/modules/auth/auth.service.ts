import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    // async validateLogin(email: string, password: string) {
    //     const user = await this.costumerModel.findOne({ email });
    //     if (!user) throw new UnauthorizedException('Usuário não encontrado');

    //     const isValid = await this.passwordService.compare(password, user.password);
    //     if (!isValid) throw new UnauthorizedException('Senha incorreta');

    //     return {
    //         message: 'Login realizado com sucesso ✅',
    //         user: {
    //             _id: user._id,
    //             name: user.name,
    //             email: user.email
    //         }
    //     };
    // }
}
