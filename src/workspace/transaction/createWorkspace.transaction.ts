import { Injectable } from "@nestjs/common";
import { FileService } from "src/files/file.service";
import { PublicFile } from "src/files/publicFile.entity";
import { RelationsStatusCode } from "src/shared/relation/enum/relationsStatusCode.enum";
import { BaseTransaction } from "src/shared/transaction/base.transaction";
import { WorkspaceRelation } from "src/workspaceRelation/workspaceRelation.entity";
import { DataSource, EntityManager } from "typeorm";
import { CreateWorkspaceDto } from "../dto/createWorkspaceDto";
import { Workspace } from "../workspace.entity";

type ExtendedCreateWorkspaceDto = CreateWorkspaceDto & { ownerId: string }

@Injectable()
export class CreateWorkspaceTransaction extends BaseTransaction<ExtendedCreateWorkspaceDto, Workspace> {
  constructor (
    private readonly fileService: FileService,
    dataSource: DataSource
  ) {
    super(dataSource);
  }
  
  protected async execute (data: ExtendedCreateWorkspaceDto, manager: EntityManager): Promise<Workspace> {
    const workspaceData: {
      title: string;
      owner_id: string;
      cover_image_id?: string;
    } = {
      title: data.title,
      owner_id: data.ownerId
    }
    let coverImage: PublicFile;
    if (data.imageObject) {
      coverImage = await this.fileService.uploadPublicFile(data.imageObject.buffer, data.title);
      workspaceData.cover_image_id = coverImage.public_file_id
    }
    const newWorkspace = manager.create<Workspace>(Workspace, workspaceData);
    const createdWorkspace = await manager.save(newWorkspace)
    if (data.coworkers?.length) {
      const workspaceRelationsData = data.coworkers.map(userId => ({ 
        workspace_id: createdWorkspace.workspace_id,
        requester_id: data.ownerId,
        addressee_id: userId,
        status_code: RelationsStatusCode.Requested
      }))
      const workspaceRelations = manager.create(WorkspaceRelation, workspaceRelationsData);
      await manager.save(workspaceRelations)
    }
    return newWorkspace;
  }
}