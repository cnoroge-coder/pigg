import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@ApiTags('animals')
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new animal' })
  @ApiResponse({ status: 201, description: 'Animal created successfully' })
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(createAnimalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all animals' })
  findAll() {
    return this.animalsService.findAll();
  }

  @Get('sows')
  @ApiOperation({ summary: 'Get all sows' })
  findAllSows() {
    return this.animalsService.findAllSows();
  }

  @Get('boars')
  @ApiOperation({ summary: 'Get all boars' })
  findAllBoars() {
    return this.animalsService.findAllBoars();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get animal by ID' })
  findOne(@Param('id') id: string) {
    return this.animalsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update animal' })
  update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalsService.update(id, updateAnimalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete animal' })
  remove(@Param('id') id: string) {
    return this.animalsService.remove(id);
  }
}
