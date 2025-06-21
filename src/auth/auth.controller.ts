import { Body, Controller, Get, Post, Req, Res, Render, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/custom';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import {Request, Response} from 'express';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage('User login')
  handleLogin(
    @Req() req,
    @Res({ passthrough: true }) response: Response
  ) {
    // return req.user;
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(
    @Body() registerUserDto: RegisterUserDto,
  ) {
    return this.authService.register(registerUserDto);
  }

  @Get('/account')
  @ResponseMessage('Get account information')
  handleGetAccount(
    @User() user: IUser
  ) {
    return { user };
  }

  @Get('/refresh')
  @Public()
  @ResponseMessage('Get User by refresh token')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processRefreshToken(refreshToken, response);
  }
  
  @Get('/logout')
  @ResponseMessage('Logout user')
  handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response
  ){
    return this.authService.logout(user, response);
  }
}
