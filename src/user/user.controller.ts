import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AccessTokenInterceptor } from 'src/access-token/access-token.interceptor';

@ApiTags('Authentication / Profile Management')
@ApiBearerAuth('Authorization')
@Controller('api/user')
export class UserController {
  constructor(protected _service: UserService) {}

  @Post()
  @UseInterceptors(AccessTokenInterceptor)
  create(@Body() _body: CreateUserDto) {
    return this._service.create(_body);
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this._service.findOneRecord({ _id });
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Post('/login')
  async login(@Body() _body: LoginDto): Promise<any> {
    return await this._service.login(_body);
  }
}
