import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateReportDto } from './dtos';
import { Report } from './report.entity';
import { User } from '../users';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto, user: User): Promise<Report> {
    const report = this.repo.create({ ...reportDto, user });
    return this.repo.save(report);
  }

  async remove(id: number): Promise<Report> {
    const report = await this.repo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(report);
  }
}
