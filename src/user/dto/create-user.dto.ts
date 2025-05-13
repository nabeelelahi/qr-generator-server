import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  password: string;
}
