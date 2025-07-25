import { BadGatewayException, BadRequestException, Injectable, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import {Request, Response} from 'express';
import { stat } from 'fs';
@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user){
      const isValid = await this.usersService.checkPassword(user.password, pass);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async login(
    user: IUser,
    response: Response
  ) {
    const { _id, name, email, role } = user;
    const payload = {
        sub: "token login",
        iss: "from server",
        _id,
        name,
        email,
        role
    };
    const refresh_token = this.createRefreshToken(payload);

    // update user with refresh_token
    await this.usersService.updateUserToken(_id, refresh_token);

    // set refresh_token as cookie
    response.cookie('refresh_token', refresh_token, 
      { httpOnly: true ,
        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRATION')),
      });

    return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id,
          name,
          email,
          role
        }
    };
  }

  async register(user: RegisterUserDto) {
    let newUser = await this.usersService.resgister(user);
    return {
      _id: newUser?._id, // in case of newUser is null or undefined
      createdAt: newUser?.createdAt,
    };
  }

  createRefreshToken = (payload) => {
    const refresh_token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRATION'))/1000
      }
    );
    return refresh_token;
  }

  processRefreshToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      let user = await this.usersService.findUserByToken(refreshToken);

      // if user is not found or refresh token is invalid
      if (user) {
        const { _id, name, email, role } = user;
        const payload = {
          sub: "token refresh",
          iss: "from server",
          _id,
          name,
          email,
          role
        };

        // create new refresh token
        const refresh_token = this.createRefreshToken(payload);

        // update user with new refresh_token in database
        await this.usersService.updateUserToken(_id, refresh_token);
        
        // clear old refresh token cookie
        response.clearCookie('refresh_token');

        // set refresh_token as cookie
        response.cookie('refresh_token', refresh_token, 
          { httpOnly: true ,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRATION')),
          });
        
        // return new access token and user information
        return {
            access_token: this.jwtService.sign(payload),
            user: {
              _id,
              name,
              email,
              role
            }
        };
      } else {
        throw new BadRequestException('Refresh token is invalid or expired');
      }
    } catch (error) {
        throw new BadRequestException('Refresh token is invalid or expired');
    }
  }

  logout = async (user: IUser, response: Response) => {
    this.usersService.updateUserToken(user._id, null);
    response.clearCookie('refresh_token');
    return 'Ok'
  }
}
