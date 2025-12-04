import { UserRole } from "src/common/constants/role-constants";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "Auths" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ nullable: false, default: "unknown" })
  declare username: string;

  @Column({ default: "defaultpassword" })
  declare password: string;

  @Column({ default: "defaultemail" })
  declare email: string;

  @Column({ type: "varchar", default: null })
  declare otp: string | null;
  @Column({ default: UserRole.USER })
  declare role: UserRole;
  @Column({ type: "boolean", default: false, nullable: true })
  declare isverify: boolean;

  @Column({ type: "bigint", nullable: true, default: 0 })
  declare otpTime: number | null;
  @UpdateDateColumn()
  updatedAt: Date;
  @CreateDateColumn()
  createdAt: Date;
}