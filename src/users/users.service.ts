import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.shema';
import mongoose, { Model } from 'mongoose';
import {hashSync, genSaltSync, compareSync } from "bcryptjs";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) 
  private UserModel: SoftDeleteModel<UserDocument>) {}

  getHashPassword = (plaintextPassword: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(plaintextPassword, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto,user: IUser) {
    const {name, email, password, age, gender, address, company, role} = createUserDto;
    const isEmailExist = await this.UserModel.findOne({email});
    if (isEmailExist) {
      throw new BadRequestException(`Email: ${email} already exists`);
    }
    const hashPassword = this.getHashPassword(password);
    let newUser = await this.UserModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      company,
      role,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    });
    return {
      _id: newUser?._id, 
      createdAt: newUser?.createdAt,
    }
  }

  async resgister(user: RegisterUserDto) {
    const {name, email, password, age, gender, address} = user;
    const isEmailExist = await this.UserModel.findOne({email});
    if (isEmailExist) {
      throw new BadRequestException(`Email: ${email} already exists`);
    }
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

  async findAll(page: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+page - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.UserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.UserModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select("-password")
      .populate(population)
      .exec();
      
    return {
      meta: { 
        current: page, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "User not found";

    return this.UserModel.findById(
      { _id: id },
      // { password: 0 } //option 2
    ).select("-password");
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
    return await this.UserModel.updateOne(
      { _id: updateUserDto._id },
      {...updateUserDto},
      {updatedBy: {
        _id: updateUserDto._id,
        email: updateUserDto.email,
      }}
    )
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "User not found";

    await this.UserModel.updateOne(
      {_id: id},
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        }
      }
    )

    return this.UserModel.softDelete({
      _id: id,
    });
  }

  updateUserToken = async (_id, refreshToken) => {
    return await this.UserModel.updateOne(
      { _id }, 
      { refreshToken }
    );
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.UserModel.findOne({
      refreshToken
    });
  }
}
