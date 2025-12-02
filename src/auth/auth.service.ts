import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import { CreateUserdto, LoginDto, VerifyDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { time } from "console";
@Injectable()
export class AuthService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kadamovkamron6@gmail.com",
      pass: process.env.MAIL_PASS,
    },
  });
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserdto): Promise<User> {
    const { username, password, email } = createUserDto;

    const foundeuser = await this.userRepo.findOne({ where: { email } });

    if (foundeuser) {
      throw new UnauthorizedException("user already exsists");
    }
    console.log(foundeuser);

    const hash = await bcrypt.hash(password, 10);

    const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
    await this.transporter.sendMail({
      from: "kadamovkamron6@gmail.com",
      to: email,
      subject: "Test",
      text: `${randomNumber}`,
    });
    const time = Date.now() + 120000;
    const newUser = this.userRepo.create({
      username,
      email,
      password: hash,
      otp: randomNumber,
      otpTime:time,
    });
    return this.userRepo.save(newUser);
  }
  // async verify(verifyDto: VerifyDto): Promise<{ message: string }> {
  //   const { email, otp } = verifyDto;

  //   const foundeuser = await this.userModel.findOne({ where: { email } });

  //   if (!foundeuser) {
  //     throw new UnauthorizedException("user not found");
  //   }
  //   const currentTime = Date.now();
  //   const expireTime = Number(foundeuser.dataValues.otpTime);

  //   if (currentTime > expireTime) {
  //     throw new BadRequestException("Otp time expired");
  //   }
  //   if (Number(foundeuser.dataValues.otp) !== Number(otp)) {
  //     throw new BadRequestException("Wrong otp");
  //   }
  //   await this.userModel.update(
  //     { otp: null, otpTime: null, isverify: true },
  //     { where: { email } }
  //   );
  //   return { message: "verify " };
  // }
  // async login(loginDto: LoginDto): Promise<{ access_token: string }> {
  //   const { password, email } = loginDto;

  //   const foundeuser = await this.userModel.findOne({ where: { email } });

  //   if (!foundeuser) {
  //     throw new UnauthorizedException("user not found");
  //   }
  //   const decode = await bcrypt.compare(
  //     password,
  //     foundeuser.dataValues.password
  //   );
  //   if (decode && foundeuser.dataValues.isverify) {
  //     const payload = {
  //       sub: foundeuser.dataValues.id,
  //       username: foundeuser.dataValues.username,
  //     };
  //     return {
  //       access_token: await this.jwtService.signAsync(payload),
  //     };
  //   } else {
  //     throw new BadRequestException("Invalid password");
  //   }
  // }
}
