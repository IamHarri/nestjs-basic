
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {

  @Prop()
  name: string;


  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({type: Object})
  company: {
    _id: string,
    name: string;
  }

  @Prop()
  role: string;

  @Prop()
  refreshToken: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop({ type: Object })
  createdBy: {
    _id: string;
    email: string;
  }

  @Prop({ type: Object })
  updatedBy: {
    _id: string;
    email: string;
  }

  @Prop({ type: Object })
  deletedBy: {
    _id: string;
    email: string;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
