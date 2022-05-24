import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { WorkspaceRelationsRepository } from 'src/workspaceRelation/repository/workspaceRelation.repository';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from './dto/createWorkspaceDto';
import { UpdateWorkspaceDto } from './dto/updateWorkspaceDto';
import { CreateWorkspaceTransaction } from './transaction/createWorkspace.transaction';
import { Workspace } from './workspace.entity';

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
    const workspaces = await this.workspaceRepository.query(`
      SELECT json_build_object(
        'workspaceId', w.workspace_id,
        'title', w.title,
        'ownerId', w.owner_id,
        'coworkers', array_remove(ARRAY_AGG(users), NULL)
      ) FROM workspaces w
      JOIN workspace_relations wr on wr.workspace_id = w.workspace_id
      CROSS JOIN LATERAL (
          SELECT user_id, username 
          FROM users AS uc
        WHERE uc.user_id = wr.addressee_id
      ) AS users
      WHERE w.owner_id = '${ownerId}' AND wr.status_code = 'A'
      GROUP BY w.workspace_id
    `)
    return workspaces.map((workspaceJsonObject) => ({ ...workspaceJsonObject.json_build_object }));
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
