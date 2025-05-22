import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

@Processor('mail')
export class MailProcessor {
  constructor(
    private readonly mailer: MailService,
    private readonly config: ConfigService,
  ) { }

  @Process('sendVerificationEmail')
  async handleSendVerification(job: Job) {
    const { email, name, verificationToken } = job.data;
    const frontEndUrl = this.config.get('FONTEND_URL');
    const verifyLink = `${frontEndUrl}/verify-email?token=${verificationToken}`;
    await this.mailer.sendVerificationEmail(email, name, verifyLink);
  }

  @Process('sendResetPasswordEmail')
  async handleReset(job: Job) {
    const { email, name, resetToken } = job.data;
    const frontEndUrl = this.config.get('FONTEND_URL');
    const link = `${frontEndUrl}/reset-password?token=${resetToken}`;
    await this.mailer.sendResetPasswordEmail(name, email, link);
  }
}
