import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Enrollment } from './entities/enrollment.entity';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { TimeslotsModule } from '../timeslots/timeslots.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, Enrollment]),
    UsersModule,
    RoomsModule,
    TimeslotsModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}