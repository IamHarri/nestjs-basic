import { Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.shema';
import mongoose, { Model } from 'mongoose';
import {hashSync, genSaltSync, compareSync } from "bcryptjs";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) 
  private UserModel: SoftDeleteModel<UserDocument>) {}

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

  async resgister(user: RegisterUserDto) {
    const {name, email, password, age, gender, address} = user;
    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.UserModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: "USER",
    });
    return newRegister;
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

  findByEmail(email: string) {
    return this.UserModel.findOne({
      email: email,
    })
  }

  checkPassword(hash: string, plain: string){
    return compareSync(plain, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.UserModel.updateOne({ _id: updateUserDto._id },{...updateUserDto})}

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "User not found";

    return this.UserModel.softDelete({
      _id: id,
    });
  }
}
