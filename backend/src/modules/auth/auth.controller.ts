import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const loginUser = await this.authService.login(loginDto.email, loginDto.password, loginDto.remember);

        res.cookie('access_token', loginUser.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        })

        return { success: true }
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        return { success: true };
    }


    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
        console.log('req.user', req.user);
        return req.user;
    }

    @Post('/check-email')
    async checkEmail(@Body('email') email: string) {
        return await this.authService.validateEmailAvailability(email)
    }
}
