import { Expose, Transform } from 'class-transformer';

import { User } from '../../users';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  price: number;

  @Expose()
  mileage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
