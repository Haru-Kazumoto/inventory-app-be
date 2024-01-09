import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExititemService } from './exititem.service';
import { CreateExititemDto } from './dto/create-exititem.dto';
import { UpdateExititemDto } from './dto/update-exititem.dto';

@Controller('exititem')
export class ExititemController {
  constructor(private readonly exititemService: ExititemService) {}

  @Post()
  create(@Body() createExititemDto: CreateExititemDto) {
    return this.exititemService.create(createExititemDto);
  }

  @Get()
  findAll() {
    return this.exititemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exititemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExititemDto: UpdateExititemDto) {
    return this.exititemService.update(+id, updateExititemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exititemService.remove(+id);
  }
}
