import { IsOptional, IsString } from 'class-validator';

export class UpdateBookmarkDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  link?: string;
}
