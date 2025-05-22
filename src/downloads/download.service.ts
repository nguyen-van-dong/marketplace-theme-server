// download.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Download } from './download.entity';
import { Template } from '../templates/template.entity';
import { Order } from '../orders/order.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class DownloadService {
  constructor(
    @InjectRepository(Download) private downloadRepo: Repository<Download>,
    @InjectRepository(Template) private templateRepo: Repository<Template>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  async generateDownloadLink(templateId: string, user: User) {
    const template = await this.templateRepo.findOne({ where: { id: templateId } });
    if (!template) throw new NotFoundException('Không tìm thấy template');

    const hasPurchased = await this.orderRepo
      .createQueryBuilder('o')
      .innerJoin('o.items', 'oi')
      .where('o.userId = :userId', { userId: user.id })
      .andWhere('oi.templateId = :templateId', { templateId })
      .andWhere('o.payment_status = :status', { status: 'paid' })
      .getCount();

    if (!hasPurchased) {
      throw new ForbiddenException('Bạn chưa mua template này');
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 phút

    const signedUrl = this.signUrl(template.download_path, expiresAt);

    const record = this.downloadRepo.create({
      user,
      template,
      download_url: signedUrl,
      expires_at: expiresAt,
    });

    await this.downloadRepo.save(record);

    return { url: signedUrl, expires_at: expiresAt };
  }

  private signUrl(path: string, expiresAt: Date): string {
    const baseUrl = 'https://cdn.mysite.com/templates/'; // Có thể là Cloudflare R2 / S3
    const token = Buffer.from(`${path}:${expiresAt.getTime()}`).toString('base64');
    return `${baseUrl}${path}?token=${token}`;
  }
}
