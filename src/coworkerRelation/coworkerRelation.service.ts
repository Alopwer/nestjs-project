import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoworkerRelation } from 'src/coworkerRelation/coworkerRelation.entity';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { SharedRelationService } from 'src/shared/relation/relation.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class CoworkerRelationService {
  constructor(
    private readonly sharedRelationService: SharedRelationService,
    private readonly userService: UserService,
    @InjectRepository(CoworkerRelation)
    private readonly coworkerRelationRepository: Repository<CoworkerRelation>
  ) {}

  async getAllApprovedCoworkerRelations(requesterId: string, username?: string) {
    const coworkerIds = await this.findApprovedRelationsByUserId(requesterId);
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
      await this.findOneRelationByIds(
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
      await this.findOneRelationOrFail({
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
      .orWhere(
        'requester_id = :addresseeId AND addressee_id = :requesterId',
        { requesterId, addresseeId },
      )
      .execute();
  }

  async getAllUsersByRequestedConnections(userId: string, username?: string) {
    return this.findAllUsersByRequestedConnections(userId, username);
  }

  async getAllUsersByReceivedConnections(userId: string, username?: string) {
    return this.findAllUsersByReceivedConnections(userId, username);
  }

  // TODO: create reporitory
  async findOneRelationByIds(requester_id: string, addressee_id: string) {
    return this.coworkerRelationRepository.findOne({
      where: [
        { requester_id, addressee_id },
        { requester_id: addressee_id, addressee_id: requester_id },
      ],
    });
  }

  async findOneRelationByIdsOrFail(requester_id: string, addressee_id: string) {
    const coworkerRelation = await this.coworkerRelationRepository.findOne({
      where: [
        { requester_id, addressee_id },
        { requester_id: addressee_id, addressee_id: requester_id },
      ]
    });
    if (!coworkerRelation) {
      throw new NotFoundException();
    }
    return coworkerRelation;
  }

  async findOneRelationOrFail<T>(coworkerRelationConditions: T) {
    const coworkerRelation = await this.coworkerRelationRepository.findOne(coworkerRelationConditions);
    if (!coworkerRelation) {
      throw new NotFoundException();
    }
    return coworkerRelation;
  }

  async findApprovedRelationsByUserId(requester_id: string) {
    const coworkerIds: Array<{ coworker_id: string }> =
      await this.coworkerRelationRepository.createQueryBuilder('coworker_relations')
        .select(`
          CASE
            WHEN requester_id = '${requester_id}' THEN addressee_id
            WHEN addressee_id = '${requester_id}' THEN requester_id
          END
        `,
          'coworker_id',
        )
        .andWhere("status_code = 'A'")
        .getRawMany();
    return coworkerIds.map((coworkerData) => coworkerData.coworker_id);
  }

  async findAllUsersByReceivedConnections(addresseeId: string, username?: string) {
    const query = this.coworkerRelationRepository.createQueryBuilder('coworker_relations')
      .select(['user_id, username, email'])
      .innerJoin('users', 'u', 'user_id = requester_id')
      .where(
        'status_code = :statusCode AND addressee_id = :addresseeId',
        { statusCode: RelationsStatusCode.Requested, addresseeId }
      )
    if (username) {
      query.andWhere('username ILIKE :username', { username })
    }
    return query.getRawMany()
  }

  async findAllUsersByRequestedConnections(requesterId: string, username?: string) {
    const query = this.coworkerRelationRepository.createQueryBuilder('coworker_relations')
      .select(['user_id, username, email'])
      .innerJoin('users', 'u', 'user_id = addressee_id')
      .where(
        'status_code = :statusCode AND requester_id = :requesterId',
        { statusCode: RelationsStatusCode.Requested, requesterId }
      )
    if (username) {
      query.andWhere('username ILIKE :username', { username })
    }
    return query.getRawMany()
  }
}
