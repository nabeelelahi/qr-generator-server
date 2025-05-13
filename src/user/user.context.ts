import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { IUser } from './entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserContext {
  constructor(@Inject(REQUEST) private _request: Request) {}

  set(user: IUser): IUser {
    this._request['user'] = user;
    return user;
  }

  get(): IUser {
    return this._request['user'];
  }
}
