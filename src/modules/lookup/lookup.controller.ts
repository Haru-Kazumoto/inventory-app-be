import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LookupService } from './lookup.service';
import { CreateLookupDto } from './dto/create-lookup.dto';
import { UpdateLookupDto } from './dto/update-lookup.dto';

@Controller('lookup')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Post()
  create(@Body() createLookupDto: CreateLookupDto) {
    return this.lookupService.create(createLookupDto);
  }

  @Get()
  findAll() {
    return this.lookupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lookupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLookupDto: UpdateLookupDto) {
    return this.lookupService.update(+id, updateLookupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lookupService.remove(+id);
  }
}
