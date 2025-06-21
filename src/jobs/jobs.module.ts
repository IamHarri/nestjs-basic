import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Jobs, JobsSchema } from './schemas/job.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Jobs.name, schema: JobsSchema }
  ])],
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule {}
