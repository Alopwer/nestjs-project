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
    @Inject('LINK_SERVICE') private readonly linkClient: ClientProxy
  ) {}

  async getAllPendingWorkspaceRelationRequestsById(
    workspace_id: string,
    addressee_id: string,
  ) {
    return this.workspaceRelationsRepository.find({
      select: ['workspace_id', 'requester_id'],
      where: {
        workspace_id,
        addressee_id,
        status_code: RelationsStatusCode.Requested,
      },
    });
  }

  async createApprovedWorkspaceRelation({
    addresseeId,
    workspaceShareCode,
  }: ICreateApprovedWorkspaceRelation) {
    const { requesterId, workspaceId } = await firstValueFrom(
      this.linkClient.send<IGetDataByWorkspaceShareCode>('get_data_by_workspace_share_code', { workspaceShareCode })
    );
    return this.createWorkspaceRelationRequest({
      requesterId,
      addresseeId,
      workspaceId,
      statusCode: RelationsStatusCode.Accepted
    });
  }

  async createWorkspaceRelationRequest({
    requesterId,
    addresseeId,
    workspaceId,
    statusCode = RelationsStatusCode.Requested
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
      await this.sharedRelationService.checkRelationStatus(
        workspaceRelationStatus.status_code,
      );
    }
    const workspaceRelation = this.workspaceRelationsRepository.create({
      requester_id: requesterId,
      addressee_id: addresseeId,
      workspace_id: workspaceId,
      status_code: statusCode
    });
    return this.workspaceRelationsRepository.save(workspaceRelation);
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

  async deleteWorkspaceRelation(workspaceId: string, requesterId: string) {
    return this.workspaceRelationsRepository
      .createQueryBuilder('workspace_relations')
      .delete()
      .from(WorkspaceRelation)
      .where('requester_id = :requesterId', { requesterId })
      .orWhere('addressee_id = :requesterId', { requesterId })
      .andWhere('workspace_id = :workspaceId', { workspaceId })
      .execute();
  }
}
