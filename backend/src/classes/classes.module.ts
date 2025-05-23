import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './entities/class.entity';
import { Enrollment } from './entities/enrollment.entity';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { TimeslotsModule } from '../timeslots/timeslots.module';
import { AttendanceService } from '../attendance/attendance.service';
import { Attendance } from '../attendance/entities/attendance.entity';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, Enrollment, Attendance]),
    UsersModule,
    RoomsModule,
    TimeslotsModule,
    forwardRef(() => AttendanceModule),
  ],
  controllers: [ClassesController],
  providers: [
    ClassesService,
    AttendanceService,
    {
      provide: 'ATTENDANCE_SERVICE',
      useExisting: AttendanceService,
    },
  ],
  exports: [ClassesService]
})
export class ClassesModule {}