export class CreateUserdto {
  username: string;
  password: string;
  email: string;
}
export class VerifyDto{
  email: string;
  otp: string;
}
export class LoginDto{
  email: string;
  password: string;
}