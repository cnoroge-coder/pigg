import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnimalDto {
  @ApiProperty({ example: 'SOW001' })
  @IsString()
  tagNo: string;

  @ApiProperty({ example: 'Lucy', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'sow', enum: ['sow', 'boar'] })
  @IsEnum(['sow', 'boar'])
  type: 'sow' | 'boar';

  @ApiProperty({ example: 'Large White', required: false })
  @IsString()
  @IsOptional()
  breed?: string;

  @ApiProperty({ example: 'Female', required: false })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: '2023-01-15', required: false })
  @IsDateString()
  @IsOptional()
  dob?: string;

  @ApiProperty({ example: 180, required: false })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: 'Group A', required: false })
  @IsString()
  @IsOptional()
  group?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
