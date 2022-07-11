import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { User } from 'src/user/user.entity';
import { WorkspaceRelationsRepository } from 'src/workspaceRelation/repository/workspaceRelation.repository';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from './dto/createWorkspaceDto';
import { UpdateWorkspaceDto } from './dto/updateWorkspaceDto';
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
    return this.workspaceRepository.query(`
      SELECT w.workspace_id,
            w.owner_id,
            w.title,
            json_strip_nulls(json_agg(json_build_object('user_id', u.user_id, 'username', u.username))) coworkers
      FROM workspaces w
      INNER JOIN workspace_relations wr ON wr.workspace_id = w.workspace_id
      INNER JOIN users u ON u.user_id = wr.addressee_id
      WHERE w.owner_id = '${ownerId}'
      AND wr.status_code = 'A'
      GROUP BY w.workspace_id
    `)
  }

  async getAllSharedWorkspaces(userId: string): Promise<any> {
    return this.workspaceRepository.query(`
      SELECT w.workspace_id,
          w.title,
          w.owner_id,
          json_strip_nulls(json_agg(json_build_object('user_id', u.user_id, 'username', u.username))) coworkers
      FROM workspaces w
      INNER JOIN workspace_relations wr ON wr.workspace_id = w.workspace_id
      INNER JOIN users u ON u.user_id = wr.addressee_id
      WHERE w.owner_id != '${userId}'
      AND wr.status_code = 'A'
      AND w.workspace_id in
      (SELECT w1.workspace_id
        FROM workspaces w1
        INNER JOIN workspace_relations wr1 ON wr1.workspace_id = w1.workspace_id
        WHERE wr1.addressee_id = '${userId}' )
      AND u.user_id != '${userId}'
      GROUP BY w.workspace_id
    `)
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
    const workspace = await this.workspaceRepository.findOne(workspaceId);
    const workspaceRelation = await this.workspaceRelationsRepository
      .createQueryBuilder('workspace_relations')
      .where('addressee_id = :userId', { userId })
      .andWhere('workspace_id = :workspaceId AND status_code = :statusCode', {
        workspaceId: workspace.workspace_id,
        statusCode: RelationsStatusCode.Accepted,
      })
      .getOne();
    return workspaceRelation;
  }

  async getWorkspaceShareCode(workspaceId: string, requesterId: string) {
    return this.linkClient.send<string>('get_workspace_share_code', {
      workspaceId,
      requesterId,
    });
  }
}
