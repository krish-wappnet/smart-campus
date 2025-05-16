import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { AttendanceModule } from '../attendance/attendance.module';
import { ClassesModule } from '../classes/classes.module';

@Module({
  imports: [AttendanceModule, ClassesModule],
  controllers: [LecturesController],
  providers: [LecturesService],
})
export class LecturesModule {}