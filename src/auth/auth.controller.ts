import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserdto, LoginDto, VerifyDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post("register")
  register(@Body() CreateUserdto: CreateUserdto): Promise<User> {
    return this.authService.register(CreateUserdto);
  }
  // @HttpCode(200)
  // @Post("verify")
  // verify(@Body() verifyDto: VerifyDto): Promise<{ message: string }> {
  //   return this.authService.verify(verifyDto);
  // }
  // @HttpCode(200)
  // @Post("login")
  // login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
  //   return this.authService.login(loginDto);
  // }
}
