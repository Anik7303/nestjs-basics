import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApproveReportDto,
  CreateReportDto,
  GetEstimateDto,
  ReportDto,
} from './dtos';
import { AdminGuard } from './guards';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards';
import { Serialize } from '../interceptors';
import { CurrentUser, User } from '../users';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Serialize(ReportDto)
  @UseGuards(AuthGuard)
  @Post()
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(parseInt(id), body.approved);
  }

  @Delete(':id')
  removeReport(@Param('id') id: number) {
    console.log({ id });
    return this.reportsService.remove(id);
  }
}
