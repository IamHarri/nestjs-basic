import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsNotEmpty, isNotEmpty } from 'class-validator';

export class UpdateJobDto extends OmitType(CreateJobDto, ['password'] as const) {
  
  @IsNotEmpty({message: '_id is required' })
  _id: string;
}