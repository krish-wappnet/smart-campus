import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Class } from '../../classes/entities/class.entity';

@Entity('rooms')
export class Room extends BaseEntity {
  @ApiProperty({ example: 'Room 101', description: 'Room name' })
  @Column()
  name: string;

  @ApiProperty({ example: 50, description: 'Room capacity' })
  @Column()
  capacity: number;

  @OneToMany(() => Class, (cls) => cls.room)
  classes: Class[];
}