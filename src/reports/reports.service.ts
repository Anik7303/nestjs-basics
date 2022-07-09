import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User): Promise<Report> {
    const report = this.repo.create({ ...reportDto, user });
    return this.repo.save(report);
  }

  async createEstimate(estimateDto: GetEstimateDto) {
    const { make, model, mileage, lng, lat, year } = estimateDto;
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('approved IS TRUE')
      .andWhere('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(5)
      .getRawOne();
  }

  async changeApproval(id: number, approved: boolean): Promise<Report> {
    // to get user information along with the report
    // const report = await this.repo.findOne({
    //   where: { id },
    //   relations: { user: true },
    // });
    const report = await this.repo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return this.repo.save(report);
  }

  async remove(id: number): Promise<Report> {
    const report = await this.repo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('report not found');
    }
    return this.repo.remove(report);
  }
}
