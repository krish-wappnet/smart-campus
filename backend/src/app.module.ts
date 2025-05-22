import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { RoomsModule } from './rooms/rooms.module';
import { TimeslotsModule } from './timeslots/timeslots.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LecturesModule } from './lectures/lectures.module';
import { LeaveRequestsModule } from './leave-requests/leave-requests.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD', '12345'),
        database: configService.get<string>('DATABASE_NAME', 'smart_campus'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV', 'development') === 'development',
        logging: configService.get<string>('NODE_ENV', 'development') === 'development',
      }),
    }),
    AuthModule,
    UsersModule,
    ClassesModule,
    RoomsModule,
    TimeslotsModule,
    AttendanceModule,
    LecturesModule,
    LeaveRequestsModule,
    ActivityLogsModule,
  ],
})
export class AppModule {}