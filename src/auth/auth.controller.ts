// auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { successResponse } from 'src/common/response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return successResponse(user, ['id', 'name', 'email'], 'Register successully, please verify email!');
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const { access_token } = await this.authService.login({ email: user.email, password: dto.password });
    const data = { ...user, access_token }
    return successResponse(data, ['name', 'email', 'access_token'], 'Login successfully!');
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const user = await this.authService.verifyEmailByToken(token);
    if (!user) throw new BadRequestException('Invalid or expired token');
    return successResponse(user, ['id', 'name', 'email'], user.message);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    const user = await this.authService.getProfile(req.user.sub);
    return successResponse(user, ['id', 'name', 'email', 'role']);
  }

  @Post('forgot-password')
  async forgot(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: 'If your email exists in our system, you will receive the email to reset the password!' };
  }

  @Post('reset-password')
  async reset(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPasswordWithToken(dto.token, dto.newPassword);
  }
}
