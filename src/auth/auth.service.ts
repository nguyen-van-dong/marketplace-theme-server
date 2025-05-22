// auth.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegisterEvent } from './events/user-register.event';
import { UserForgotPasswordEvent } from './events/user-forgot-password.event';
import { generateRandomToken } from 'src/common/helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    private config: ConfigService,
  ) { }

  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const exits = await this.userRepo.countBy({ email: dto.email });
    if (exits > 0) {
      throw new BadRequestException('Email already exists');
    }
    const user = this.userRepo.create({ ...dto, password: hash, email_verification_token: generateRandomToken() });
    const saved = await this.userRepo.save(user);

    const token = this.jwtService.sign(
      { sub: saved.id },
      { secret: process.env.JWT_SECRET, expiresIn: '30m' },
    );

    this.eventEmitter.emit(
      'user.registered',
      new UserRegisterEvent(saved.email, saved.name, token)
    );
    return saved;
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (user && !user.is_verified) {
      throw new UnauthorizedException('User does not activated.');
    }
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async verifyEmailByToken(token: string) {
    const user = await this.userRepo.findOneBy({ email_verification_token: token });
    if (!user) throw new BadRequestException('Token is invalid!');
    if (user.is_verified) {
      return { ...user, message: 'Account already verified!' };
    }
    user.is_verified = true;
    user.email_verification_token = null;
    await this.userRepo.save(user);

    return {...user, message: 'Verify account succesfully!' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password!');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { secret: this.config.get('JWT_SECRET') || 'SECRET_KEY' }),
    };
  }

  async getProfile(userId: string) {
    return await this.userRepo.findOneBy({ id: userId });
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) return;

    user.reset_password_token = generateRandomToken();
    user.reset_password_expires = new Date(Date.now() + 15 * 60 * 1000);
    await this.userRepo.save(user);

    const token = this.jwtService.sign(
      { sub: user.id },
      { secret: this.config.get('JWT_SECRET') || 'SECRET_KEY', expiresIn: '15m' },
    );

    this.eventEmitter.emit(
      'user.forgot_password',
      new UserForgotPasswordEvent(user.email, user.name, token)
    );
  }

  async resetPasswordWithToken(token: string, newPassword: string) {
    const user = await this.userRepo.findOneBy({ reset_password_token: token });

    if (!user || !user.reset_password_expires || new Date() > user.reset_password_expires) {
      throw new BadRequestException('Invalid token or token was expired!');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.reset_password_token = null;
    user.reset_password_expires = null;

    await this.userRepo.save(user);

    return { message: 'Update password successully!' };
  }
}
