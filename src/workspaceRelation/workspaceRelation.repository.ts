import { NotFoundException } from '@nestjs/common';
import { AppDataSource } from 'src/config/data-source';
import { WorkspaceRelation } from './workspaceRelation.entity';

export const WorkspaceRelationRepository = AppDataSource.getRepository(
  WorkspaceRelation,
).extend({
  async findOneRelationByIds(requester_id: string, workspace_id: string) {
    return this.findOneBy({
      requester_id,
      workspace_id,
    });
  },
  async findOneRelationOrFail<T>(coworkerRelationConditions: T) {
    const workspaceRelation = await this.findOneBy(coworkerRelationConditions);
    if (!workspaceRelation) {
      throw new NotFoundException();
    }
    return workspaceRelation;
  },
});
