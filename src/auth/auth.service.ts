// auth.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/user.entity';
import { MailService } from 'src/mailer/mailer.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegisterEvent } from './events/user-register.event';
import { UserForgotPasswordEvent } from './events/user-forgot-password.event';
import { generateRandomToken } from 'src/common/helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private eventEmitter: EventEmitter2,
  ) { }

  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hash });

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

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Sai email hoặc mật khẩu');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: string) {
    return this.userRepo.findOneBy({ id: userId });
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) return;

    user.reset_password_token = generateRandomToken();
    user.reset_password_expires = new Date(Date.now() + 15 * 60 * 1000);
    await this.userRepo.save(user);

    const token = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    this.eventEmitter.emit(
      'user.forgot_password',
      new UserForgotPasswordEvent(user.email, user.name, token)
    );
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userRepo.findOneBy({ id: payload.sub });
      if (!user) throw new Error('User not found');

      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepo.save(user);
      return { message: 'Cập nhật mật khẩu thành công' };
    } catch (err) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  async resetPasswordWithToken(token: string, newPassword: string) {
    const user = await this.userRepo.findOneBy({ reset_password_token: token });

    if (!user || !user.reset_password_expires || new Date() > user.reset_password_expires) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }
  
    user.password = await bcrypt.hash(newPassword, 10);
    user.reset_password_token = null;
    user.reset_password_expires = null;

    await this.userRepo.save(user);

    return { message: 'Cập nhật mật khẩu thành công 🎉' };
  }
}
