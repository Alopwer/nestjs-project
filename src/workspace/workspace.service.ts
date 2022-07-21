import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { User } from 'src/user/user.entity';
import { WorkspaceRelationsRepository } from 'src/workspaceRelation/repository/workspaceRelation.repository';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from './dto/createWorkspaceDto';
import { UpdateWorkspaceDto } from './dto/updateWorkspaceDto';
import { allOwnerWorkspacesQuery } from './query/allOwnerWorkspaces.query';
import { allSharedWorkspacesQuery } from './query/allSharedWorkspaces.query';
import { CreateWorkspaceTransaction } from './transaction/createWorkspace.transaction';
import { Workspace } from './workspace.entity';

export type JsonBuildObject<T> = {
  json_build_object: T
}

export type GetWorkspaceResponse = {
  workspaceId: string;
  title: string;
  ownerId: string;
  coworkers: User[];
}

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @Inject('LINK_SERVICE') private readonly linkClient: ClientProxy,
    private readonly workspaceRelationsRepository: WorkspaceRelationsRepository,
    private readonly createWorkspaceTransaction: CreateWorkspaceTransaction
  ) {}

  async getAllOwnerWorkspaces(ownerId: string): Promise<any> {
    return this.workspaceRepository.query(allOwnerWorkspacesQuery, [ownerId])
  }

  async getAllSharedWorkspaces(userId: string): Promise<any> {
    return this.workspaceRepository.query(allSharedWorkspacesQuery, [userId])
  }

  async createWorkspace(
    ownerId: string,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspace> {
    if (createWorkspaceDto.coworkers.length) {
      return this.createWorkspaceTransaction.run({ ...createWorkspaceDto, ownerId });
    }
    const newWorkspace = this.workspaceRepository.create({
      title: createWorkspaceDto.title,
      owner_id: ownerId,
    });
    return this.workspaceRepository.save(newWorkspace);
  }

  async updateWorkspace(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<Workspace> {
    await this.workspaceRepository.update(id, updateWorkspaceDto);
    return this.workspaceRepository.findOne(id);
  }

  async deleteWorkspace(id: string): Promise<string> {
    await this.workspaceRepository.delete(id);
    return id;
  }

  async checkOwner(userId: string, workspaceId: string): Promise<boolean> {
    const workspace = await this.workspaceRepository.findOne(workspaceId);
    if (!workspace) {
      throw new NotFoundException();
    }
    return workspace.owner_id === userId;
  }

  async checkMember(userId: string, workspaceId: string) {
    return this.workspaceRelationsRepository
      .createQueryBuilder('workspace_relations')
      .where('addressee_id = :userId', { userId })
      .andWhere('workspace_id = :workspaceId AND status_code = :statusCode', {
        workspaceId,
        statusCode: RelationsStatusCode.Accepted,
      })
      .getOne();
  }

  async getWorkspaceShareCode(workspaceId: string, requesterId: string) {
    return this.linkClient.send<string>('get_workspace_share_code', {
      workspaceId,
      requesterId,
    });
  }
}
