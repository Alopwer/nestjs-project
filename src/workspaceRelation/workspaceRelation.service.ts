import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, map } from 'rxjs';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { SharedRelationService } from 'src/shared/relation/relation.service';
import { ICreateApprovedWorkspaceRelation } from './interface/createApprovedWorkspaceRelation.interface';
import { ICreateWorkspaceRelation } from './interface/createWorkspaceRelation.interface';
import { IGetDataByWorkspaceShareCode } from './interface/getDataByWorkspaceShareCode.interface';
import { WorkspaceRelationsRepository } from './repository/workspaceRelation.repository';
import { WorkspaceRelation } from './workspaceRelation.entity';

@Injectable()
export class WorkspaceRelationService {
  constructor(
    private readonly workspaceRelationsRepository: WorkspaceRelationsRepository,
    private readonly sharedRelationService: SharedRelationService,
    @Inject('LINK_SERVICE') private readonly linkClient: ClientProxy,
  ) {}

  async getAllWorkspaceRelationMembers(
    workspaceId: string,
    ownerId: string
  ) {
    const memberIds: Array<{ member_id: string }> =
      await this.workspaceRelationsRepository.createQueryBuilder('workspace_relations')
        .select(['addressee_id as member_id'])
        .andWhere("workspace_id = :workspaceId AND status_code = :statusCode", { workspaceId, statusCode: RelationsStatusCode.Accepted })
        .getRawMany();
    return [ownerId, ...memberIds.map((memberData) => memberData.member_id)];
  }

  async getPendingWorkspaceRelationRequestsByUserId(
    addresseeId: string,
  ) {
    return this.workspaceRelationsRepository.createQueryBuilder('workspace_relations')
      .select(["title", "owner_id", "w.workspace_id as workspace_id"])
      .innerJoin("workspaces", "w", "w.workspace_id = workspace_relations.workspace_id")
      .where("addressee_id = :addresseeId AND status_code = :statusCode", { addresseeId, statusCode: RelationsStatusCode.Requested })
      .getRawMany<{ title: string, owner_id: string, workspace_id: string }>();
  }

  async createApprovedWorkspaceRelation({
    addresseeId,
    workspaceShareCode,
  }: ICreateApprovedWorkspaceRelation) {
    const { requesterId, workspaceId } = await firstValueFrom(
      this.linkClient.send<IGetDataByWorkspaceShareCode>(
        'get_data_by_workspace_share_code',
        { workspaceShareCode },
      ),
    );
    if (requesterId === addresseeId) {
      throw new BadRequestException();
    }
    return this.saveRelation({
      requesterId,
      addresseeId,
      workspaceId,
      statusCode: RelationsStatusCode.Accepted,
    });
  }

  async createWorkspaceRelationRequest({
    requesterId,
    addresseeId,
    workspaceId,
  }: ICreateWorkspaceRelation) {
    if (requesterId === addresseeId) {
      throw new BadRequestException();
    }
    const workspaceRelationStatus =
      await this.workspaceRelationsRepository.findOneRelationByIds(
        requesterId,
        workspaceId,
      );
    if (workspaceRelationStatus) {
      this.sharedRelationService.checkRelationStatus(
        workspaceRelationStatus.status_code,
      );
    }
    return this.saveRelation({
      requesterId,
      addresseeId,
      workspaceId,
    });
  }

  async acceptWorkspaceRelationRequest(
    workspaceId: string,
    addresseeId: string,
  ) {
    const findConditions = {
      workspace_id: workspaceId,
      addressee_id: addresseeId,
      status_code: RelationsStatusCode.Requested,
    };
    const coworkerRelation =
      await this.workspaceRelationsRepository.findOneRelationOrFail(
        findConditions,
      );
    coworkerRelation.status_code = RelationsStatusCode.Accepted;
    return this.workspaceRelationsRepository.save(coworkerRelation);
  }

  async deleteWorkspaceRelation(workspaceId: string, addresseeId: string) {
    return this.workspaceRelationsRepository.delete({
      workspace_id: workspaceId,
      addressee_id: addresseeId
    })
  }

  async saveRelation({
    requesterId,
    addresseeId,
    workspaceId,
    statusCode = RelationsStatusCode.Requested,
  }: ICreateWorkspaceRelation) {
    const workspaceRelation = this.workspaceRelationsRepository.create({
      requester_id: requesterId,
      addressee_id: addresseeId,
      workspace_id: workspaceId,
      status_code: statusCode,
    });
    return this.workspaceRelationsRepository.save(workspaceRelation);
  }
}
