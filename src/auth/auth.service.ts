import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "./entities/user-entity";
import { CreateUserDto, LoginDto, VerifyDto } from "./dto/create.user-dto";
import * as bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRole } from "src/common/constants/role-constants";

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

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, email } = createUserDto;

    const foundeuser = await this.userRepo.findOne({ where: { email } });

    if (foundeuser) {
      throw new UnauthorizedException("user already exsists");
    }

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
      otpTime: time,
    });
    return this.userRepo.save(newUser);
  }
  async verify(verifyDto: VerifyDto): Promise<{ message: string }> {
    const { email, otp } = verifyDto;

    const foundeuser = await this.userRepo.findOne({ where: { email } });

    if (!foundeuser) {
      throw new UnauthorizedException("user not found");
    }
    const currentTime = Date.now();
    const expireTime = Number(foundeuser.otpTime);

    if (currentTime > expireTime) {
      throw new BadRequestException("Otp time expired");
    }
    if (Number(foundeuser.otp) !== Number(otp)) {
      throw new BadRequestException("Wrong otp");
    }
    await this.userRepo.update(foundeuser.id, { otp :"0",otpTime:0,isverify:true} );
    return { message: "verify " };
  }
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { password, email } = loginDto;

    const foundeuser = await this.userRepo.findOne({ where: { email } });

    if (!foundeuser) {
      throw new UnauthorizedException("user not found");
    }
    const decode = await bcrypt.compare(
      password,
      foundeuser.password
    );
    if (decode && foundeuser.isverify) {
      const payload = {
        sub: foundeuser.id,
        username: foundeuser.username,
        UserRole:foundeuser.role
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new BadRequestException("Invalid password");
    }
  }
  async deleteUser(id: number):Promise<boolean> {
    const foundeuser = await this.userRepo.findOne({ where: { id } });

    if (!foundeuser) {
      throw new UnauthorizedException("user nit found");
    }
    await this.userRepo.delete({id})
    return true
  }
}
