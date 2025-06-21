
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JobsDocument = HydratedDocument<Jobs>;


@Schema({timestamps: true})
export class Jobs {
  @Prop()
  name: string;

  @Prop({required: true})
  skills: string;

  @Prop({type: Object})
  company: {
    _id: string,
    name: string;
  }

  @Prop({required: true})
  location: string;

  @Prop({required: true})
  salary: number;

  @Prop({required: true})
  quantity: number;
  
  @Prop({required: true})
  level: string;

  @Prop({required: true})
  description: string;

  @Prop()
  startDate: Date;  

  @Prop()
  endDate: Date;  

  @Prop()
  isActive: boolean;  

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

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

  @Prop()
  isDeleted: boolean;

}

export const JobsSchema = SchemaFactory.createForClass(Jobs);
