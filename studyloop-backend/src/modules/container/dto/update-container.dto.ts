import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateContainerDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}