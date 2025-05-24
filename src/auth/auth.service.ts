import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user){
      const isValid = await this.usersService.checkPassword(pass, user.password)
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }
}
