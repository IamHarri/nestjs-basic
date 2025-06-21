import { Type } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';


class Company {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  name: string;
}

export class CreateJobDto {

  @IsNotEmpty({message: 'Name is required' })
  name: string;

  @IsNotEmpty({message: 'Skills is required' })
  skills: string;

  @IsNotEmpty({message: 'Location is required' })
  location: string;


  @IsNotEmpty({message: 'Salary is required' })
  salary: number;

  @IsNotEmpty({message: 'Quantity is required' })
  quantity: number;

  @IsNotEmpty({message: 'Level is required' })
  level: number;

  // @IsNotEmpty({message: 'email is required' })
  // @IsEmail({}, {message: 'Invalid email format'})
  // email: string;
  
  @IsNotEmpty({message: 'Description is required' })
  description: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
