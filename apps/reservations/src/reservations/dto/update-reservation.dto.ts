// export class UpdateReservationDto{
//     startDate: Date;
//     endDate: Date;
//     placeId: string;
//     invoiceId: string;
// }

import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
