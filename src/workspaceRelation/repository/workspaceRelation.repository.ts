import { NotFoundException } from "@nestjs/common";
import { EntityRepository, FindOneOptions, Repository } from "typeorm";
import { WorkspaceRelation } from "../workspaceRelation.entity";

@EntityRepository(WorkspaceRelation)
export class WorkspaceRelationsRepository extends Repository<WorkspaceRelation> {
  async findOneRelationByIds(requester_id: string, workspace_id: string) {
    return this.findOne({
      where: [
        { requester_id, workspace_id },
      ] 
    });
  }
  
  async findOneRelationOrFail<T>(coworkerRelationConditions: T) {
    const workspaceRelation = await this.findOne(coworkerRelationConditions);
    if (!workspaceRelation) {
      throw new NotFoundException();
    }
    return workspaceRelation;
  }
}