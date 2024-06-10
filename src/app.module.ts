import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { DbService } from './db.service';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [DbService],
})
export class AppModule {}
