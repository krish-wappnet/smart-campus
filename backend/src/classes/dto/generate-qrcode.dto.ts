import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class GenerateQrCodeDto {
  @ApiProperty({ description: 'Class ID to generate QR code for' })
  @IsString()
  @IsNotEmpty()
  classId: string;

  @ApiProperty({
    description: 'Duration in minutes for which the QR code should be valid',
    minimum: 1,
    maximum: 120,
    default: 15
  })
  @IsNumber()
  @Min(1)
  @Max(120)
  duration: number = 15;
}

export class GenerateQrCodeResponse {
  @ApiProperty({ description: 'QR code data URL' })
  qrCode: string;

  @ApiProperty({ description: 'Expiration timestamp' })
  expiresAt: Date;

  @ApiProperty({ 
    description: 'Class information',
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      facultyName: { type: 'string' }
    }
  })
  classInfo: {
    id: string;
    name: string;
    facultyName: string;
  };
}
