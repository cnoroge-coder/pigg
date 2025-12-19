import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnimalDto {
  @ApiProperty({ example: 'SOW001' })
  @IsString()
  tagNo: string;

  @ApiProperty({ example: 'Lucy', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'sow', enum: ['sow', 'boar', 'piglet'] })
  @IsEnum(['sow', 'boar', 'piglet'])
  type: 'sow' | 'boar' | 'piglet';

  @ApiProperty({ example: 'Large White', required: false })
  @IsString()
  @IsOptional()
  breed?: string;

  @ApiProperty({ example: '2023-01-15', required: false })
  @IsDateString()
  @IsOptional()
  dob?: string;

  @ApiProperty({ example: 180, required: false })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: null, required: false })
  @IsOptional()
  weightHistory?: any;

  @ApiProperty({ example: 'L001', required: false })
  @IsString()
  @IsOptional()
  litterNo?: string;

  @ApiProperty({ example: 'grower', required: false })
  @IsString()
  @IsOptional()
  stage?: string;

  @ApiProperty({ example: 'active', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: '2023-01-15', required: false })
  @IsDateString()
  @IsOptional()
  entryDate?: string;

  @ApiProperty({ example: 'Bred On Farm', required: false })
  @IsString()
  @IsOptional()
  obtainedMethod?: string;

  @ApiProperty({ example: 'Local Farm', required: false })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiProperty({ example: 'SOW001', required: false })
  @IsString()
  @IsOptional()
  motherTag?: string;

  @ApiProperty({ example: 'BOAR001', required: false })
  @IsString()
  @IsOptional()
  fatherTag?: string;

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
