import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendResetPasswordEmail(name: string, to: string, resetLink: string) {
        await this.mailerService.sendMail({
            to,
            subject: 'Khôi phục mật khẩu',
            html: `
        <p>Bạn đã yêu cầu khôi phục mật khẩu.</p>
        <p>Click vào link bên dưới để đặt lại mật khẩu:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Link này sẽ hết hạn sau 15 phút.</p>
      `,
        });
    }

    async sendVerificationEmail(email: string, name: string, link: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Xác nhận tài khoản của bạn',
            html: `
      <p>Xin chào ${name},</p>
      <p>Bạn đã đăng ký tài khoản. Vui lòng xác nhận bằng cách click vào link dưới:</p>
      <a href="${link}">${link}</a>
      <p>Link này sẽ hết hạn sau 30 phút.</p>
    `,
        });
    }
}
