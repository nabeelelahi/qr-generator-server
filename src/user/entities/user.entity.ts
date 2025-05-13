import { Schema, Document, model } from 'mongoose';

import * as bcrypt from 'bcrypt';

export const name = 'users';

export interface IUser extends Document {
  email: string;
  password: string;
}

export const schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
});

schema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('email') && this.email)
    this.email = this.email.toLowerCase();
  next();
});

export const User = model(name, schema);
