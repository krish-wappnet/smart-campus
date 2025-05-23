import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class MarkAttendanceDto {
  @ApiProperty({ description: 'QR code from the lecture' })
  @IsString()
  @IsNotEmpty()
  qrCode: string;

  @ApiProperty({ description: 'Student ID' })
  @IsUUID()
  studentId: string;
}

export class GenerateQrCodeResponse {
  @ApiProperty({ description: 'QR code data URL' })
  qrCode: string;

  @ApiProperty({ description: 'Expiration timestamp' })
  expiresAt: Date;
}
