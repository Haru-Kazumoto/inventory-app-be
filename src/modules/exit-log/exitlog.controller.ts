import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExitlogService } from './exitlog.service';
import { CreateExitlogDto } from './dto/create-exitlog.dto';
import { UpdateExitlogDto } from './dto/update-exitlog.dto';

@Controller('exitlog')
export class ExitlogController {
  constructor(private readonly exitlogService: ExitlogService) {}

  @Post()
  create(@Body() createExitlogDto: CreateExitlogDto) {
    return this.exitlogService.create(createExitlogDto);
  }

  @Get()
  findAll() {
    return this.exitlogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exitlogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExitlogDto: UpdateExitlogDto) {
    return this.exitlogService.update(+id, updateExitlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exitlogService.remove(+id);
  }
}
