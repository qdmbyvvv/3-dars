import { IsEmail, IsInt, IsString, length, Length, Max, Min } from "class-validator";

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @Length(8, 20)
  password: string;
  @IsEmail()
  @Length(3, 100)
  email: string;
}
export class VerifyDto {
  @IsEmail()
  @Length(3, 100)
  email: string;

 @IsString()
  otp: string;
}
export class LoginDto {
  @IsEmail()
  @Length(3, 100)
  email: string;
  @IsString()
  @Length(8, 20)
  password: string;
}
