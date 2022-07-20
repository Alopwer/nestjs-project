import { BadRequestException, Injectable } from '@nestjs/common';
import { RelationsStatusCode } from './enum/relationsStatusCode.enum';

@Injectable()
export class SharedRelationService {
  checkRelationStatus(status_code: RelationsStatusCode) {
    if (status_code === RelationsStatusCode.Accepted) {
      throw new BadRequestException('Relation already exists.');
    }
    if (status_code === RelationsStatusCode.Requested) {
      throw new BadRequestException('Request already sent.');
    }
  }
}
