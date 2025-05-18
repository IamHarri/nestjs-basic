import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.shema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  // create(createUserDto: CreateUserDto) {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async create(name: string, email: string, password: string) {
    let user = await this.UserModel.create({
      name,
      email,
      password,
    });
    return user;
  }

  findAll() {
    return `This action returns all users  aha`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
