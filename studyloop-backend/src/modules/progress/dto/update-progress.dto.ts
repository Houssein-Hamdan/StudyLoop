import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateProgressDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  scrollPosition?: number;

}