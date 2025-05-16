import { Module } from '@nestjs/common';
import { TimeslotsService } from './timeslots.service';
import { TimeslotsController } from './timeslots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timeslot } from './entities/timeslot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Timeslot])],
  controllers: [TimeslotsController],
  providers: [TimeslotsService],
  exports: [TimeslotsService],
})
export class TimeslotsModule {}