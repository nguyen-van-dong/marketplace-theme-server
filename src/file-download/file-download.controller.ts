import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('files')
export class FileDownloadController {
  @Get(':filename')
  async serveFile(
    @Param('filename') filename: string,
    @Query('token') token: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    if (!token) throw new ForbiddenException('Thiếu token tải');

    const decoded = Buffer.from(token, 'base64url').toString();
    const { path: expectedPath, userId, ip, expires } = JSON.parse(decoded);

    if (expectedPath !== `templates/${filename}`) {
      throw new ForbiddenException('Sai đường dẫn');
    }

    if (Date.now() > expires) {
      throw new ForbiddenException('Link đã hết hạn');
    }

    const requestIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (requestIp !== ip) {
      throw new ForbiddenException('IP không khớp');
    }

    const fullPath = path.resolve(__dirname, `../../storage/${expectedPath}`);
    if (!fs.existsSync(fullPath)) {
      throw new ForbiddenException('Không tìm thấy file');
    }

    return res.download(fullPath); // có thể thay bằng res.sendFile nếu cần
  }
}
