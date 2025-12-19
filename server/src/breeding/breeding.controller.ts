import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreatePregnancyDto {
  sowTag: string;
  boarTag?: string;
  breedingDate: string;
  expectedDate?: string;
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
    return this.prisma.pregnancy.create({
      data: {
        sowTag: createPregnancyDto.sowTag,
        boarTag: createPregnancyDto.boarTag || null,
        breedingDate: new Date(createPregnancyDto.breedingDate),
        expectedDate: createPregnancyDto.expectedDate ? new Date(createPregnancyDto.expectedDate) : null,
        status: createPregnancyDto.status || 'Expecting',
        notes: createPregnancyDto.notes || null,
      },
    });
  }

  @Get()
  async findAll() {
    return this.prisma.pregnancy.findMany({
      orderBy: { breedingDate: 'desc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.pregnancy.findUnique({
      where: { id },
      include: { litter: true },
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreatePregnancyDto>) {
    return this.prisma.pregnancy.update({
      where: { id },
      data: {
        ...(updateData.sowTag && { sowTag: updateData.sowTag }),
        ...(updateData.boarTag && { boarTag: updateData.boarTag }),
        ...(updateData.breedingDate && { breedingDate: new Date(updateData.breedingDate) }),
        ...(updateData.expectedDate && { expectedDate: new Date(updateData.expectedDate) }),
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.notes !== undefined && { notes: updateData.notes }),
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
        pregnancy: true,
      },
      orderBy: { farrowDate: 'desc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.litter.findUnique({
      where: { id },
      include: {
        pregnancy: true,
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
