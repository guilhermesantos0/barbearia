import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    const token = req?.cookies?.access_token;
                    return token;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'GuilhermeSantosProgramacao2025'
        });
    }

    async validate(payload: any) {
        return payload;
    }
}
