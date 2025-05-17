import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UsersModule, MongooseModule.forRoot('mongodb+srv://admin:CeS4SD5E0v973Gar@cluster-demo.gpnvujc.mongodb.net/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
