// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from 'src/user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { CustomMailerModule } from 'src/mailer/mailer.module';
import { UserRegisterListener } from './listeners/user-register.listener';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailQueueService } from 'src/queues/mail-queue.service';
import { MailQueueModule } from 'src/queues/mail-queue.module';
import { UserForgotPasswordListener } from './listeners/user-forgot-password.listener';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: 'your_jwt_secret',
            signOptions: { expiresIn: '7d' },
        }),
        CustomMailerModule,
        MailQueueModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        EventEmitter2,
        UserRegisterListener,
        UserForgotPasswordListener,
    ],
})
export class AuthModule { }
