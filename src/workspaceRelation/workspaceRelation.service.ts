import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { SharedRelationService } from 'src/shared/relation/relation.service';
import { Repository } from 'typeorm';
import { ICreateApprovedWorkspaceRelation } from './interface/createApprovedWorkspaceRelation.interface';
import { ICreateWorkspaceRelation } from './interface/createWorkspaceRelation.interface';
import { IGetDataByWorkspaceShareCode } from './interface/getDataByWorkspaceShareCode.interface';
import { WorkspaceRelation } from './workspaceRelation.entity';

@Injectable()
export class WorkspaceRelationService {
  constructor(
    private readonly sharedRelationService: SharedRelationService,
    @Inject('LINK_SERVICE') private readonly linkClient: ClientProxy,
    @InjectRepository(WorkspaceRelation)
    private readonly workspaceRelationRepository: Repository<WorkspaceRelation>
  ) {}

  async getPendingWorkspaceRelationRequestsByUserId(
    addresseeId: string,
  ) {
    return this.workspaceRelationRepository.createQueryBuilder('workspace_relations')
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
      ).pipe(
        //TODO: check why wrong error code???
        catchError((err) => { throw new Error(err) }))
      )
    if (requesterId === addresseeId) {
      throw new BadRequestException();
    }
    const workspaceRelation = await this.workspaceRelationRepository.findOneBy({
      requester_id: requesterId,
      addressee_id: addresseeId,
      workspace_id: workspaceId,
      status_code: RelationsStatusCode.Accepted
    })
    if (workspaceRelation) {
      throw new BadRequestException('You are already in workspace');
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
      await this.findOneRelationByIds(
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
      await this.findOneRelationOrFail(
        findConditions,
      );
    coworkerRelation.status_code = RelationsStatusCode.Accepted;
    return this.workspaceRelationRepository.save(coworkerRelation);
  }

  async deleteWorkspaceRelation(workspaceId: string, addresseeId: string) {
    return this.workspaceRelationRepository.delete({
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
    const workspaceRelation = this.workspaceRelationRepository.create({
      requester_id: requesterId,
      addressee_id: addresseeId,
      workspace_id: workspaceId,
      status_code: statusCode,
    });
    return this.workspaceRelationRepository.save(workspaceRelation);
  }

  async findOneRelationByIds(requester_id: string, workspace_id: string) {
    return this.workspaceRelationRepository.findOne({
      where: [{ requester_id, workspace_id }],
    });
  }

  async findOneRelationOrFail<T>(coworkerRelationConditions: T) {
    const workspaceRelation = await this.workspaceRelationRepository.findOne(coworkerRelationConditions);
    if (!workspaceRelation) {
      throw new NotFoundException();
    }
    return workspaceRelation;
  }
}
