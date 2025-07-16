import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
    private readonly SALT_ROUNDS = 10;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        console.log(plain, hash)
        return bcrypt.compare(plain, hash);
    }
}
