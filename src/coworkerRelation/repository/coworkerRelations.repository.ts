import { NotFoundException } from '@nestjs/common';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { EntityRepository, FindOneOptions, Repository } from 'typeorm';
import { CoworkerRelation } from '../coworkerRelation.entity';
import { CowokerRelationsConditions } from '../interface/coworkerRelationsConditions';

@EntityRepository(CoworkerRelation)
export class CoworkerRelationsRepository extends Repository<CoworkerRelation> {
  async findOneRelationByIds(requester_id: string, addressee_id: string) {
    return this.findOne({
      where: [
        { requester_id, addressee_id },
        { requester_id: addressee_id, addressee_id: requester_id },
      ],
    });
  }

  async findOneRelationByIdsOrFail(requester_id: string, addressee_id: string) {
    const findConditions: FindOneOptions<CowokerRelationsConditions> = {
      where: [
        { requester_id, addressee_id },
        { requester_id: addressee_id, addressee_id: requester_id },
      ],
    };
    const coworkerRelation = await this.findOne(findConditions);
    if (!coworkerRelation) {
      throw new NotFoundException();
    }
    return coworkerRelation;
  }

  async findOneRelationOrFail<T>(coworkerRelationConditions: T) {
    const coworkerRelation = await this.findOne(coworkerRelationConditions);
    if (!coworkerRelation) {
      throw new NotFoundException();
    }
    return coworkerRelation;
  }

  async findApprovedRelationsByUserId(requester_id: string) {
    const coworkerIds: Array<{ coworker_id: string }> =
      await this.createQueryBuilder('coworker_relations')
        .select(
          `CASE
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
    const query = this.createQueryBuilder('coworker_relations')
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
    const query = this.createQueryBuilder('coworker_relations')
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
