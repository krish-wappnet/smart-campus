import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timeslot } from './entities/timeslot.entity';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';

@Injectable()
export class TimeslotsService {
  private readonly logger = new Logger(TimeslotsService.name);

  constructor(
    @InjectRepository(Timeslot)
    private readonly timeslotsRepository: Repository<Timeslot>,
  ) {}

  async create(createTimeslotDto: CreateTimeslotDto): Promise<Timeslot> {
    const timeslot = this.timeslotsRepository.create(createTimeslotDto);
    const savedTimeslot = await this.timeslotsRepository.save(timeslot);
    this.logger.log(`Created new timeslot: ${savedTimeslot.dayOfWeek} ${savedTimeslot.startTime}-${savedTimeslot.endTime}`);
    return savedTimeslot;
  }

  async findAll(): Promise<Timeslot[]> {
    return this.timeslotsRepository.find();
  }

  async findOne(id: string): Promise<Timeslot | undefined> {
    return this.timeslotsRepository.findOne({ where: { id } });
  }
}