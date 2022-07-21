import { BadRequestException, Injectable } from '@nestjs/common';
import { CoworkerRelation } from 'src/coworkerRelation/coworkerRelation.entity';
import { CoworkerRelationsRepository } from 'src/coworkerRelation/repository/coworkerRelations.repository';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { SharedRelationService } from 'src/shared/relation/relation.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CoworkerRelationService {
  constructor(
    private readonly coworkerRelationsRepository: CoworkerRelationsRepository,
    private readonly sharedRelationService: SharedRelationService,
    private readonly userService: UserService,
  ) {}

  async getAllApprovedCoworkerRelations(requesterId: string, username?: string) {
    const coworkerIds = await this.coworkerRelationsRepository.findApprovedRelationsByUserId(requesterId);
    if (username) {
      return this.userService.getUsersByIdsAndUsername(coworkerIds, username);
    }
    return this.userService.getUsersByIds(coworkerIds);
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
      this.sharedRelationService.checkRelationStatus(
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
    const coworkerRelation =
      await this.coworkerRelationsRepository.findOneRelationOrFail({
        requester_id: requesterId,
        addressee_id: addresseeId,
        status_code: RelationsStatusCode.Requested,
      });
    coworkerRelation.status_code = RelationsStatusCode.Accepted;
    return this.coworkerRelationsRepository.save(coworkerRelation);
  }

  async deleteCoworkerRelation(requesterId: string, addresseeId: string) {
    return this.coworkerRelationsRepository
      .createQueryBuilder('coworker_relations')
      .delete()
      .from(CoworkerRelation)
      .where('requester_id = :requesterId AND addressee_id = :addresseeId', {
        requesterId,
        addresseeId,
      })
      .orWhere(
        'requester_id = :addresseeId AND addressee_id = :requesterId',
        { requesterId, addresseeId },
      )
      .execute();
  }

  async getAllUsersByRequestedConnections(userId: string, username?: string) {
    return this.coworkerRelationsRepository.findAllUsersByRequestedConnections(userId, username);
  }

  async getAllUsersByReceivedConnections(userId: string, username?: string) {
    return this.coworkerRelationsRepository.findAllUsersByReceivedConnections(userId, username);
  }
}
