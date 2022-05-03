import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CoworkerRelation } from "src/coworkerRelation/coworkerRelation.entity";
import { CoworkerRelationsRepository } from "src/coworkerRelation/repository/coworkerRelations.repository";
import { RelationsStatusCode } from "src/shared/relation/enum/relationsStatusCode.enum";
import { SharedRelationService } from "src/shared/relation/relation.service";
import { Connection } from "typeorm/connection/Connection";

@Injectable()
export class CoworkerRelationService {
  private coworkerRelationsRepository: CoworkerRelationsRepository;
  constructor(
    private readonly connection: Connection,
    private readonly sharedRelationService: SharedRelationService
  ) {
    this.coworkerRelationsRepository = this.connection.getCustomRepository(CoworkerRelationsRepository)
  }

  async getAllCoworkerRelationsById(requesterId: string) {
    return await this.coworkerRelationsRepository.findAllRelationsById(requesterId);
  }

  async createCoworkerRelationRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) {
      throw new BadRequestException();
    }
    const coworkerRelationStatus = await this.coworkerRelationsRepository.findOneRelationByIds(requesterId, addresseeId);
    if (coworkerRelationStatus) {
      await this.sharedRelationService.checkRelationStatus(coworkerRelationStatus.status_code);
    }
    const coworkerRelation = this.coworkerRelationsRepository.create({
      requester_id: requesterId,
      addressee_id: addresseeId,
      status_code: RelationsStatusCode.Requested
    });
    return await this.coworkerRelationsRepository.save(coworkerRelation);
  }

  async acceptCoworkerRelationRequest(requesterId: string, addresseeId: string) {
    const findConditions = { 
      requester_id: requesterId,
      addressee_id: addresseeId,
      status_code: RelationsStatusCode.Requested
    }
    const coworkerRelation = await this.coworkerRelationsRepository.findOneRelationOrFail(findConditions);
    coworkerRelation.status_code = RelationsStatusCode.Accepted;
    return await this.coworkerRelationsRepository.save(coworkerRelation);
  }

  async deleteCoworkerRelation(requesterId: string, addresseeId: string) {
    return await this.coworkerRelationsRepository
      .createQueryBuilder('coworker_relations')
      .delete()
      .from(CoworkerRelation)
      .where('requester_id = :requester_id AND addressee_id = :addressee_id', { requesterId, addresseeId })
      .orWhere('requester_id = :addressee_id AND addressee_id = :requester_id', { requesterId, addresseeId })
      .execute();
  }
}