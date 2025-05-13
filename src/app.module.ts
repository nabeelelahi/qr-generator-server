import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.GWT_SECRET,
      signOptions: { expiresIn: '10d' },
    }),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION_STRING),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
