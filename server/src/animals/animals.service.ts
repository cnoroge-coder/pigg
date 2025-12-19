import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  async create(createAnimalDto: CreateAnimalDto) {
    const animal = await this.prisma.animal.create({
      data: {
        ...createAnimalDto,
        dob: createAnimalDto.dob ? new Date(createAnimalDto.dob) : null,
      },
    });
    return animal;
  }

  async findAll() {
    try {
      const animals = await this.prisma.animal.findMany();
      return animals;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  async findAllSows() {
    try {
      const sows = await this.prisma.animal.findMany({
        where: { type: 'sow' },
      });
      return sows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  async findAllBoars() {
    try {
      const boars = await this.prisma.animal.findMany({
        where: { type: 'boar' },
      });
      return boars;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  async findOne(id: string) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
    });
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${id} not found`);
    }
    return animal;
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto) {
    const animal = await this.prisma.animal.update({
      where: { id },
      data: {
        ...updateAnimalDto,
        dob: updateAnimalDto.dob ? new Date(updateAnimalDto.dob) : undefined,
      },
    });
    return animal;
  }

  async remove(id: string) {
    await this.prisma.animal.delete({
      where: { id },
    });
    return { message: `Animal ${id} deleted successfully` };
  }
}
