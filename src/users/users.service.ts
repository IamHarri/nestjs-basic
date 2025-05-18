import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.shema';
import mongoose, { Model } from 'mongoose';
import {hashSync, genSaltSync } from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  getHashPassword = (plaintextPassword: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(plaintextPassword, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    let user = await this.UserModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashPassword,
    });
    return user;
  }

  findAll() {
    return `This action returns all users  aha`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "User not found";

    return this.UserModel.findById({
      _id: id,
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.UserModel.updateOne({ _id: updateUserDto._id },{...updateUserDto})}

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "User not found";

    return this.UserModel.deleteOne({
      _id: id,
    });
  }
}
