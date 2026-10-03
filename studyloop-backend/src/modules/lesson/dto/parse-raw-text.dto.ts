import { IsNotEmpty, IsString } from 'class-validator';

export class ParseRawTextDto {
  @IsString()
  @IsNotEmpty()
  rawContent: string;
}