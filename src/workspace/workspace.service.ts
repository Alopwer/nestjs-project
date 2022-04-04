import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { CreateWorkspaceDto } from "./dto/createWorkspaceDto";
import { UpdateWorkspaceDto } from "./dto/updateWorkspaceDto";
import { Workspace } from "./workspace.entity";

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>
  ) {}

  async getAllOwnerWorkspaces(ownerId: string): Promise<Workspace[]> {
    return await this.workspaceRepository.find({ ownerId });
  }

  async createWorkspace(owner: User, createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
    const newWorkspace = this.workspaceRepository.create({ ...createWorkspaceDto, owner });
    await this.workspaceRepository.save(newWorkspace);
    return newWorkspace;
  }

  async updateWorkspace(id: string, updateWorkspaceDto: UpdateWorkspaceDto): Promise<Workspace> {
    await this.workspaceRepository.update(id, updateWorkspaceDto);
    return await this.workspaceRepository.findOne(id);
  }

  async deleteWorkspace(id: string): Promise<string> {
    await this.workspaceRepository.delete(id);
    return id;
  }

  async checkOwner(userId: string, workspaceId: string): Promise<boolean> {
    const workspace = await this.workspaceRepository.findOne(workspaceId);
    return workspace.ownerId === userId;
  }
}