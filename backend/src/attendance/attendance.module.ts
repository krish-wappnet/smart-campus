import { Module, forwardRef } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { ClassesModule } from '../classes/classes.module';
import { UsersModule } from '../users/users.module';
import { ClassesService } from '../classes/classes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    forwardRef(() => ClassesModule),
    UsersModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    {
      provide: 'CLASSES_SERVICE',
      useExisting: forwardRef(() => ClassesService),
    },
  ],
  exports: [AttendanceService],
})
export class AttendanceModule {}