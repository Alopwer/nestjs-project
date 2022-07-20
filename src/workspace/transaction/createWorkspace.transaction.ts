import { Injectable } from "@nestjs/common";
import { RelationsStatusCode } from "src/shared/relation/enum/relationsStatusCode.enum";
import { BaseTransaction } from "src/shared/transaction/base.transaction";
import { WorkspaceRelation } from "src/workspaceRelation/workspaceRelation.entity";
import { Connection, EntityManager } from "typeorm";
import { CreateWorkspaceDto } from "../dto/createWorkspaceDto";
import { Workspace } from "../workspace.entity";

type ExtendedCreateWorkspaceDto = CreateWorkspaceDto & { ownerId: string }

@Injectable()
export class CreateWorkspaceTransaction extends BaseTransaction<ExtendedCreateWorkspaceDto, Workspace> {
  constructor (connection: Connection) {
    super(connection);
  }
  
  protected async execute (data: ExtendedCreateWorkspaceDto, manager: EntityManager): Promise<Workspace> {
    const newWorkspace = manager.create(Workspace, { title: data.title, owner_id: data.ownerId });
    const createdWorkspace = await manager.save(newWorkspace)
    const workspaceRelationsData = data.coworkers.map(userId => ({ 
      workspace_id: createdWorkspace.workspace_id,
      requester_id: data.ownerId,
      addressee_id: userId,
      status_code: RelationsStatusCode.Requested
    }))
    const workspaceRelations = manager.create(WorkspaceRelation, workspaceRelationsData);
    await manager.save(workspaceRelations)
    return newWorkspace;
  }
}