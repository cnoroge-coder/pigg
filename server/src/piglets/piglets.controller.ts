import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreatePigletDto {
  tagNo: string;
  litterId: string;
  sex: 'male' | 'female';
  birthWeight?: number;
  currentWeight?: number;
  notes?: string;
}

interface CreateWeightRecordDto {
  pigletId: string;
  weight: number;
  date?: string;
  notes?: string;
}

interface CreateFeedRecordDto {
  pigletId: string;
  feedType: string;
  quantity: number;
  unit?: string;
  date?: string;
  cost?: number;
  notes?: string;
}

@Controller('piglets')
export class PigletsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async create(@Body() createPigletDto: CreatePigletDto) {
    return this.prisma.piglet.create({
      data: {
        tagNo: createPigletDto.tagNo,
        litterId: createPigletDto.litterId,
        sex: createPigletDto.sex,
        birthWeight: createPigletDto.birthWeight || null,
        currentWeight: createPigletDto.currentWeight || null,
        notes: createPigletDto.notes || null,
      },
      include: {
        litter: {
          include: {
            pregnancy: {
              include: {
                sow: true,
                boar: true,
              },
            },
          },
        },
      },
    });
  }

  @Get()
  async findAll(@Query('sex') sex?: string, @Query('status') status?: string) {
    const where: any = {};
    if (sex) where.sex = sex;
    if (status) where.status = status;

    return this.prisma.piglet.findMany({
      where,
      include: {
        litter: {
          include: {
            pregnancy: {
              include: {
                sow: true,
                boar: true,
              },
            },
          },
        },
        weightRecords: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.piglet.findUnique({
      where: { id },
      include: {
        litter: {
          include: {
            pregnancy: {
              include: {
                sow: true,
                boar: true,
              },
            },
          },
        },
        weightRecords: {
          orderBy: { date: 'desc' },
        },
        feedRecords: {
          orderBy: { date: 'desc' },
        },
      },
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreatePigletDto> & { status?: string; healthStatus?: string; weaningDate?: string; weaningWeight?: number; saleDate?: string; salePrice?: number; buyer?: string }) {
    const dataToUpdate: any = {};
    
    if (updateData.currentWeight !== undefined) dataToUpdate.currentWeight = updateData.currentWeight;
    if (updateData.status) dataToUpdate.status = updateData.status;
    if (updateData.healthStatus) dataToUpdate.healthStatus = updateData.healthStatus;
    if (updateData.notes !== undefined) dataToUpdate.notes = updateData.notes;
    if (updateData.weaningDate) dataToUpdate.weaningDate = new Date(updateData.weaningDate);
    if (updateData.weaningWeight !== undefined) dataToUpdate.weaningWeight = updateData.weaningWeight;
    if (updateData.saleDate) dataToUpdate.saleDate = new Date(updateData.saleDate);
    if (updateData.salePrice !== undefined) dataToUpdate.salePrice = updateData.salePrice;
    if (updateData.buyer !== undefined) dataToUpdate.buyer = updateData.buyer;

    return this.prisma.piglet.update({
      where: { id },
      data: dataToUpdate,
      include: {
        litter: true,
        weightRecords: true,
        feedRecords: true,
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.piglet.delete({
      where: { id },
    });
  }

  // Weight records
  @Post('weight-records')
  async createWeightRecord(@Body() createDto: CreateWeightRecordDto) {
    // Also update the piglet's current weight
    await this.prisma.piglet.update({
      where: { id: createDto.pigletId },
      data: { currentWeight: createDto.weight },
    });

    return this.prisma.pigletWeightRecord.create({
      data: {
        pigletId: createDto.pigletId,
        weight: createDto.weight,
        date: createDto.date ? new Date(createDto.date) : new Date(),
        notes: createDto.notes || null,
      },
      include: {
        piglet: true,
      },
    });
  }

  @Get(':id/weight-records')
  async getWeightRecords(@Param('id') id: string) {
    return this.prisma.pigletWeightRecord.findMany({
      where: { pigletId: id },
      orderBy: { date: 'desc' },
    });
  }

  // Feed records
  @Post('feed-records')
  async createFeedRecord(@Body() createDto: CreateFeedRecordDto) {
    return this.prisma.pigletFeedRecord.create({
      data: {
        pigletId: createDto.pigletId,
        feedType: createDto.feedType,
        quantity: createDto.quantity,
        unit: createDto.unit || 'kg',
        date: createDto.date ? new Date(createDto.date) : new Date(),
        cost: createDto.cost || null,
        notes: createDto.notes || null,
      },
      include: {
        piglet: true,
      },
    });
  }

  @Get(':id/feed-records')
  async getFeedRecords(@Param('id') id: string) {
    return this.prisma.pigletFeedRecord.findMany({
      where: { pigletId: id },
      orderBy: { date: 'desc' },
    });
  }
}
