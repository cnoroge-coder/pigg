import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateAlertDto {
  type: string;
  priority?: string;
  title: string;
  description?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  dueDate?: string;
}

@Controller('alerts')
export class AlertsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async create(@Body() createAlertDto: CreateAlertDto) {
    return this.prisma.alert.create({
      data: {
        type: createAlertDto.type,
        priority: createAlertDto.priority || 'medium',
        title: createAlertDto.title,
        description: createAlertDto.description || null,
        relatedEntityType: createAlertDto.relatedEntityType || null,
        relatedEntityId: createAlertDto.relatedEntityId || null,
        dueDate: createAlertDto.dueDate ? new Date(createAlertDto.dueDate) : null,
      },
    });
  }

  @Get()
  async findAll(@Query('status') status?: string, @Query('priority') priority?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    return this.prisma.alert.findMany({
      where,
      orderBy: [
        { priority: 'asc' }, // critical first
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  @Get('active')
  async getActive() {
    return this.prisma.alert.findMany({
      where: { status: 'active' },
      orderBy: [
        { priority: 'asc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 10,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.alert.findUnique({
      where: { id },
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateAlertDto> & { status?: string }) {
    const dataToUpdate: any = {};
    
    if (updateData.status) {
      dataToUpdate.status = updateData.status;
      if (updateData.status === 'resolved') {
        dataToUpdate.resolvedAt = new Date();
      }
    }
    if (updateData.priority) dataToUpdate.priority = updateData.priority;
    if (updateData.title) dataToUpdate.title = updateData.title;
    if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
    if (updateData.dueDate) dataToUpdate.dueDate = new Date(updateData.dueDate);

    return this.prisma.alert.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.alert.delete({
      where: { id },
    });
  }
}
