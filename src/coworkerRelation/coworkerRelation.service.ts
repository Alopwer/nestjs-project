import { BadRequestException, Injectable } from '@nestjs/common';
import { CoworkerRelation } from 'src/coworkerRelation/coworkerRelation.entity';
import { CoworkerRelationsRepository } from 'src/coworkerRelation/repository/coworkerRelations.repository';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { SharedRelationService } from 'src/shared/relation/relation.service';

@Injectable()
export class CoworkerRelationService {
  constructor(
    private readonly coworkerRelationsRepository: CoworkerRelationsRepository,
    private readonly sharedRelationService: SharedRelationService,
  ) {}

  async getAllCoworkerRelations(requesterId: string) {
    return this.coworkerRelationsRepository.findAllRelationsByUserId(requesterId);
  }

  async createCoworkerRelationRequest(
    requesterId: string,
    addresseeId: string,
  ) {
    if (requesterId === addresseeId) {
      throw new BadRequestException();
    }
    const coworkerRelationStatus =
      await this.coworkerRelationsRepository.findOneRelationByIds(
        requesterId,
        addresseeId,
      );
    if (coworkerRelationStatus) {
      await this.sharedRelationService.checkRelationStatus(
        coworkerRelationStatus.status_code,
      );
    }
    const coworkerRelation = this.coworkerRelationsRepository.create({
      requester_id: requesterId,
      addressee_id: addresseeId,
      status_code: RelationsStatusCode.Requested,
    });
    return this.coworkerRelationsRepository.save(coworkerRelation);
  }

  async acceptCoworkerRelationRequest(
    requesterId: string,
    addresseeId: string,
  ) {
    const findConditions = {
      requester_id: requesterId,
      addressee_id: addresseeId,
      status_code: RelationsStatusCode.Requested,
    };
    const coworkerRelation =
      await this.coworkerRelationsRepository.findOneRelationOrFail(
        findConditions,
      );
    coworkerRelation.status_code = RelationsStatusCode.Accepted;
    return this.coworkerRelationsRepository.save(coworkerRelation);
  }

  async deleteCoworkerRelation(requesterId: string, addresseeId: string) {
    return this.coworkerRelationsRepository
      .createQueryBuilder('coworker_relations')
      .delete()
      .from(CoworkerRelation)
      .where('requester_id = :requester_id AND addressee_id = :addressee_id', {
        requesterId,
        addresseeId,
      })
      .orWhere(
        'requester_id = :addressee_id AND addressee_id = :requester_id',
        { requesterId, addresseeId },
      )
      .execute();
  }
}
