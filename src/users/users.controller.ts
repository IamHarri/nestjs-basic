import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/custom';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create a new user')
  create(
    @Body() createUserDto: CreateUserDto,
    @User() user: IUser,
  ) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ResponseMessage('Fetch user with paginate')
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Fetch a user by id')
  findOne(
    @Param('id') 
    id: string
  ) {
    return this.usersService.findOne(id); // +id converts string to number
  }


  @Patch()
  @ResponseMessage('Update a user')
  update(
    @Body() 
    updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage("Delete a User")
  remove(
    @Param('id') id: string,
    @User() user: IUser, 
  ) {
    return this.usersService.remove(id, user);
  }
}
