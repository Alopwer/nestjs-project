import { NotFoundException } from '@nestjs/common';
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

  async findAllRelationsByUserId(requester_id: string) {
    const coworkerIds: Array<{ coworker_id: string }> =
      await this.createQueryBuilder('coworker_relations')
        .select(
          `CASE
        WHEN requester_id = '${requester_id}' THEN requester_id
        WHEN addressee_id = '${requester_id}' THEN addressee_id
        END
      `,
          'coworker_id',
        )
        .andWhere("status_code = 'A'")
        .getRawMany();
    return coworkerIds.map((coworkerData) => coworkerData.coworker_id);
  }
}
