import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateReportDto, ReportDto } from './dtos';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards';
import { CurrentUser } from '../decorators';
import { Serialize } from '../interceptors';
import { User } from '../users';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Serialize(ReportDto)
  @UseGuards(AuthGuard)
  @Post()
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Delete(':id')
  removeReport(@Param('id') id: number) {
    console.log({ id });
    return this.reportsService.remove(id);
  }
}
