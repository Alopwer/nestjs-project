import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoworkerRelation } from 'src/coworkerRelation/coworkerRelation.entity';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { SharedRelationService } from 'src/shared/relation/relation.service';
import { UserRepository } from 'src/user/user.repository';
import { Repository } from 'typeorm';
import { CoworkerRelationRepository } from './repository/coworkerRelation.repository';

@Injectable()
export class CoworkerRelationService {
  constructor(
    private readonly sharedRelationService: SharedRelationService,
    @InjectRepository(CoworkerRelation)
    private readonly coworkerRelationRepository: Repository<CoworkerRelation>,
  ) {}

  async getAllApprovedCoworkerRelations(
    requesterId: string,
    username?: string,
  ) {
    const coworkerIds =
      await CoworkerRelationRepository.findApprovedRelationsByUserId(
        requesterId,
      );
    if (username) {
      return UserRepository.findUsersByIdsAndUsername(coworkerIds, username);
    }
    return UserRepository.findUsersByIds(coworkerIds);
  }

  async createCoworkerRelationRequest(
    requesterId: string,
    addresseeId: string,
  ) {
    if (requesterId === addresseeId) {
      throw new BadRequestException();
    }
    const coworkerRelationStatus =
      await CoworkerRelationRepository.findOneRelationByIds(
        requesterId,
        addresseeId,
      );
    if (coworkerRelationStatus) {
      this.sharedRelationService.checkRelationStatus(
        coworkerRelationStatus.status_code,
      );
    }
    const coworkerRelation = this.coworkerRelationRepository.create({
      requester_id: requesterId,
      addressee_id: addresseeId,
      status_code: RelationsStatusCode.Requested,
    });
    return this.coworkerRelationRepository.save(coworkerRelation);
  }

  async acceptCoworkerRelationRequest(
    requesterId: string,
    addresseeId: string,
  ) {
    const coworkerRelation =
      await CoworkerRelationRepository.findOneRelationOrFail({
        requester_id: requesterId,
        addressee_id: addresseeId,
        status_code: RelationsStatusCode.Requested,
      });
    coworkerRelation.status_code = RelationsStatusCode.Accepted;
    return this.coworkerRelationRepository.save(coworkerRelation);
  }

  async deleteCoworkerRelation(requesterId: string, addresseeId: string) {
    return this.coworkerRelationRepository
      .createQueryBuilder('coworker_relations')
      .delete()
      .from(CoworkerRelation)
      .where('requester_id = :requesterId AND addressee_id = :addresseeId', {
        requesterId,
        addresseeId,
      })
      .orWhere('requester_id = :addresseeId AND addressee_id = :requesterId', {
        requesterId,
        addresseeId,
      })
      .execute();
  }

  async getAllUsersByRequestedConnections(userId: string, username?: string) {
    return CoworkerRelationRepository.findAllUsersByRequestedConnections(
      userId,
      username,
    );
  }

  async getAllUsersByReceivedConnections(userId: string, username?: string) {
    return CoworkerRelationRepository.findAllUsersByReceivedConnections(
      userId,
      username,
    );
  }
}
