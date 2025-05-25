
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

class UserReference {
  @Prop()
  _id: string;

  @Prop()
  email: string;
}


@Schema({timestamps: true})
export class Company {
  @Prop()
  name: string;

  @Prop({required: true})
  address: string;

  @Prop()
  description: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop({ type: UserReference })
  createdBy: UserReference;

  @Prop({ type: UserReference })
  updatedBy: UserReference;

  @Prop({ type: UserReference })
  deletedBy: UserReference;
  
  // @Prop()
  // createdBy: {
  //   _id: string;
  //   email: string;
  // }

  // @Prop()
  // updatedBy: {
  //   _id: string;
  //   email: string;
  // }

  // @Prop()
  // deletedBy: {
  //   _id: string;
  //   email: string;
  // }
}

export const CompanySchema = SchemaFactory.createForClass(Company);
