import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoworkerRelationsRepository } from 'src/coworkerRelation/repository/coworkerRelations.repository';
import { WorkspaceRelation } from 'src/workspaceRelation/workspaceRelation.entity';
import { Connection, Repository } from 'typeorm';
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
