import {
  IsString,
  IsUrl,
  IsOptional,
  IsIn,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  price: number;

  @IsOptional()
  @IsString()
  download_path?: string | null;

  @IsOptional()
  @IsUrl()
  thumbnail_url?: string | null;

  @IsOptional()
  @IsUrl()
  preview_url?: string | null;

  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: 'draft' | 'published';

  @IsUUID()
  categoryId: string;
}
