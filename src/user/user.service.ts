import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { name, schema } from './entities/user.entity';
import { strSlug } from 'src/utils/helpers';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';
import { UserContext } from './user.context';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(name) protected _model: Model<typeof schema>,
    protected userContext: UserContext,
  ) {}

  public _softDelete = () => true;

  public _fillables = () => ['email'];

  async create(body: CreateUserDto) {
    await this._beforeRegister(body);
    const response = await this._model.create(body);
    return response;
  }

  public _beforeRegister = async (payload: Partial<CreateUserDto>) => {
    if (payload.email) payload.email = payload.email.toLocaleLowerCase();
    const exists = await this.findOneRecord({
      email: payload.email,
    });
    if (exists) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Validation Error',
          message: ['Email Already Exists'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  };

  async findOneRecord(condition: object, select: string[] = this._fillables()) {
    return await this._model.findOne(condition).select(select);
  }

  async login(_body: LoginDto): Promise<CreateUserDto> {
    const user = await this.verifyCredentails(_body);
    if (!user)
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Validation Error',
          message: ['Invalid Credentials'],
        },
        HttpStatus.BAD_REQUEST,
      );
    return user;
  }

  async verifyCredentails(_body: LoginDto): Promise<any> {
    const users = await this._model.find({
      email: _body.email,
      deleted_at: null,
    });
    if (!users.length) return false;
    const [user] = users;
    const verifyPassword = bcrypt.compareSync(
      _body['password'],
      user['password'],
    );
    if (!verifyPassword) return false;
    return user;
  }

  async generateUserName(name: string): Promise<string> {
    let username = strSlug(name);
    let usernameExists = await this.verifyUser('username', username);
    while (usernameExists) {
      username = `${username}-${Math.floor(Math.random() * 1000)}`;
      usernameExists = await this.verifyUser('username', username);
    }
    return username;
  }

  async verifyUser(key: string, value?: string): Promise<boolean> {
    const record = await this.findOneRecord({ [key]: value });
    return record ? true : false;
  }
}
