import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  listReports() {
    return this.reportsService.find();
  }

  @Get(':id')
  findReport(@Param('id') id: string) {
    return this.reportsService.findOne(parseInt(id));
  }

  @Post()
  createPost(@Body() body: any) {
    return this.reportsService.create();
  }

  @Patch(':id')
  updateReport(@Param('id') id: string, @Body() body: any) {
    return this.reportsService.update(parseInt(id), body);
  }

  @Delete(':id')
  deleteReport(@Param('id') id: string) {
    return this.reportsService.remove(parseInt(id));
  }
}
