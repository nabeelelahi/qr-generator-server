import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { schema, name } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserContext } from './user.context';

@Module({
  imports: [MongooseModule.forFeature([{ name, schema }])],
  controllers: [UserController],
  providers: [UserService, UserContext],
  exports: [UserService, UserContext],
})
export class UserModule {}
