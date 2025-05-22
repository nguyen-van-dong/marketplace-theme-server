// dto/create-template.dto.ts
export class CreateTemplateDto {
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail_url: string;
  preview_url: string;
  download_path: string;
  status?: 'draft' | 'published';
}
