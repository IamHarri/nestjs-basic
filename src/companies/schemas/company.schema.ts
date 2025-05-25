
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;


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

export const CompanySchema = SchemaFactory.createForClass(Company);
