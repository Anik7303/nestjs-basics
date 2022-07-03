import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  async find(): Promise<any[]> {
    return [];
  }

  async findOne(id: number): Promise<any> {
    return {};
  }

  async create(): Promise<any> {
    return {};
  }

  async update(id: number, attrs: Partial<any>): Promise<any> {
    return {};
  }

  async remove(id: number): Promise<any> {
    return {};
  }
}
