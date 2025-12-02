import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { User } from "./auth/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      port: 5432,
      username: "postgres",
      password: "qdmbyvvv_3008.",
      database: "homework",
      entities:[User],
      synchronize: true,
      logging : false
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
