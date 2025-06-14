import { Type } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';



class Company {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty({message: 'Name is required' })
  name: string;

  @IsEmail({},{message: 'Email is not valid' })
  @IsNotEmpty({message: 'Email is required' })
  email: string;

  @IsNotEmpty({message: 'Password is required' })
  password: string;
  
  @IsNotEmpty({message: 'Age is required' })
  age: number;

  @IsNotEmpty({message: 'Gender is required' })
  gender: string;

  @IsNotEmpty({message: 'Address is required' })
  address: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({message: 'Role is required' })
  role: string;
}


export class RegisterUserDto {
  @IsNotEmpty({message: 'Name is required' })
  name: string;

  @IsEmail({},{message: 'Email is not valid' })
  @IsNotEmpty({message: 'Email is required' })
  email: string;

  @IsNotEmpty({message: 'Password is required' })
  password: string;
  
  @IsNotEmpty({message: 'Age is required' })
  age: number;

  @IsNotEmpty({message: 'Gender is required' })
  gender: string;

  @IsNotEmpty({message: 'Address is required' })
  address: string;
}
