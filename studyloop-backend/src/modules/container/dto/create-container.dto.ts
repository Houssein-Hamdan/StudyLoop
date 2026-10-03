import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateContainerDto {
  @IsString()
  @IsNotEmpty({ message: 'Container name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}