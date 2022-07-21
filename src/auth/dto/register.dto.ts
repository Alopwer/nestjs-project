import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsEmail({}, {
    message: 'Email should be valid'
  })
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Password should consist of 8 characters at least'
  })
  password: string;
}
