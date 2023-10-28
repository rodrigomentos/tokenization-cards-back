import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import {  ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CommonConstants } from '../utils/documentation.util';
import { LoginAuthResponseDto } from './dto/login-auth-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    loginUser(@Body() loginUserDto: LoginAuthDto) {
        return this.authService.login(loginUserDto);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh_token')
    @ApiOkResponse({
        type: LoginAuthResponseDto
    })
    @ApiForbiddenResponse({description: CommonConstants.ACCESS_DENIED})
    refreshTokens(@Req() req: Request) {
        const userId = req.user['userId'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@Req() req: Request) {
       this.authService.logout(req.user['userId']);
    }
}
