import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreatePregnancyDto {
  sowId: string;
  boarId?: string;
  dateServed: string;
  expectedFarrowing?: string;
  status?: string;
  notes?: string;
}

interface CreateLitterDto {
  pregnancyId: string;
  farrowDate: string;
  numberBorn: number;
  alive: number;
  dead: number;
  weaningDate?: string;
  weaningWeight?: number;
  notes?: string;
}

@Controller('pregnancies')
export class PregnanciesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async create(@Body() createPregnancyDto: CreatePregnancyDto) {
    // Calculate expected farrowing date if not provided (114 days from breeding)
    const dateServed = new Date(createPregnancyDto.dateServed);
    const expectedFarrowing = createPregnancyDto.expectedFarrowing 
      ? new Date(createPregnancyDto.expectedFarrowing)
      : new Date(dateServed.getTime() + 114 * 24 * 60 * 60 * 1000);

    return this.prisma.pregnancy.create({
      data: {
        sowId: createPregnancyDto.sowId,
        boarId: createPregnancyDto.boarId || null,
        dateServed: dateServed,
        expectedFarrowing: expectedFarrowing,
        status: createPregnancyDto.status || 'pregnant',
        notes: createPregnancyDto.notes || null,
      },
      include: {
        sow: true,
        boar: true,
      },
    });
  }

  @Get()
  async findAll() {
    return this.prisma.pregnancy.findMany({
      include: {
        sow: true,
        boar: true,
        litter: true,
      },
      orderBy: { dateServed: 'desc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.pregnancy.findUnique({
      where: { id },
      include: { 
        sow: true,
        boar: true,
        litter: true 
      },
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreatePregnancyDto>) {
    const dataToUpdate: any = {};
    
    if (updateData.sowId) dataToUpdate.sowId = updateData.sowId;
    if (updateData.boarId !== undefined) dataToUpdate.boarId = updateData.boarId;
    if (updateData.dateServed) dataToUpdate.dateServed = new Date(updateData.dateServed);
    if (updateData.expectedFarrowing) dataToUpdate.expectedFarrowing = new Date(updateData.expectedFarrowing);
    if (updateData.status) dataToUpdate.status = updateData.status;
    if (updateData.notes !== undefined) dataToUpdate.notes = updateData.notes;

    return this.prisma.pregnancy.update({
      where: { id },
      data: dataToUpdate,
      include: {
        sow: true,
        boar: true,
        litter: true,
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.pregnancy.delete({
      where: { id },
    });
  }
}

@Controller('litters')
export class LittersController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async create(@Body() createLitterDto: CreateLitterDto) {
    return this.prisma.litter.create({
      data: {
        pregnancyId: createLitterDto.pregnancyId,
        farrowDate: new Date(createLitterDto.farrowDate),
        numberBorn: createLitterDto.numberBorn,
        alive: createLitterDto.alive,
        dead: createLitterDto.dead,
        weaningDate: createLitterDto.weaningDate ? new Date(createLitterDto.weaningDate) : null,
        weaningWeight: createLitterDto.weaningWeight || null,
        notes: createLitterDto.notes || null,
      },
    });
  }

  @Get()
  async findAll() {
    return this.prisma.litter.findMany({
      include: {
        pregnancy: {
          include: {
            sow: true,
            boar: true,
          },
        },
      },
      orderBy: { farrowDate: 'desc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.litter.findUnique({
      where: { id },
      include: {
        pregnancy: {
          include: {
            sow: true,
            boar: true,
          },
        },
      },
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateLitterDto>) {
    return this.prisma.litter.update({
      where: { id },
      data: {
        ...(updateData.farrowDate && { farrowDate: new Date(updateData.farrowDate) }),
        ...(updateData.numberBorn !== undefined && { numberBorn: updateData.numberBorn }),
        ...(updateData.alive !== undefined && { alive: updateData.alive }),
        ...(updateData.dead !== undefined && { dead: updateData.dead }),
        ...(updateData.weaningDate && { weaningDate: new Date(updateData.weaningDate) }),
        ...(updateData.weaningWeight !== undefined && { weaningWeight: updateData.weaningWeight }),
        ...(updateData.notes !== undefined && { notes: updateData.notes }),
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.litter.delete({
      where: { id },
    });
  }
}
