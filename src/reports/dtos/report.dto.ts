import { Expose, Transform } from 'class-transformer';
import { User } from 'src/users';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  price: number;

  @Expose()
  mileage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  approved: boolean;

  @Transform(({ obj }) => obj.user?.id)
  @Expose()
  userId: number;
}
