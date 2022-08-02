import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { Workspace } from 'src/workspace/workspace.entity';
import { WorkspaceRelation } from 'src/workspaceRelation/workspaceRelation.entity';
import { In, Repository } from 'typeorm';
import { Collection } from './collection.entity';
import { CollectionData } from './collectionData.entity';
import { UpdateCollectionDto } from './dto/updateCollection.dto';
import { UpdateCollectionDataDto } from './dto/updateCollectionData.dto';
import { CreateCollectionData } from './interface/createCollectionData.interface';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(CollectionData)
    private readonly collectionDataRepository: Repository<CollectionData>,
    @InjectRepository(WorkspaceRelation)
    private readonly workspaceRelationRepository: Repository<WorkspaceRelation>
  ) {}

  async createCollection(createCollectionData: CreateCollectionData): Promise<Collection> {
    const collectionData = this.collectionDataRepository.create({
      description: createCollectionData.description,
    });
    const newCollection = this.collectionRepository.create({
      ...createCollectionData,
      collection_data: collectionData,
    });
    await this.collectionRepository.save(newCollection);
    return newCollection;
  }

  async updateCollection(collectionId: string, updateCollectionDto: UpdateCollectionDto) {
    await this.collectionRepository.update(collectionId, updateCollectionDto);
    return this.collectionRepository.findOneBy({
      collection_id: collectionId
    });
  }

  async updateCollectionData(
    collectionDataId: string,
    updateCollectionDataDto: UpdateCollectionDataDto,
  ) {
    await this.collectionDataRepository.update(collectionDataId, updateCollectionDataDto);
    return this.collectionDataRepository.findOneBy({
      collection_data_id: collectionDataId
    });
  }

  async deleteCollection(collectionId: string) {
    await this.collectionRepository.delete(collectionId);
    return collectionId;
  }

  async checkOwner(userId: string, collectionId: string) {
    const collection = await this.collectionRepository.findOne({
      where: { collection_id: collectionId },
      relations: ['workspace']
    });
    return collection.workspace.owner_id === userId;
  }

  async checkMember(userId: string, collectionId: string) {
    const collection = await this.collectionRepository.findOne({
      where: { collection_id: collectionId },
      relations: ['workspace']
    });
    const workspaceRelation = await this.workspaceRelationRepository
      .createQueryBuilder('workspace_relations')
      .where('addressee_id = :userId', { userId })
      .andWhere('workspace_id = :workspaceId AND status_code = :statusCode', {
        workspaceId: collection.workspace_id,
        statusCode: RelationsStatusCode.Accepted,
      })
      .getOne();
    return workspaceRelation;
  }

  async getAllWorkspaceCollections(workspaceId: string): Promise<Collection[]> {
    return this.collectionRepository.find({ where: { workspace_id: workspaceId }, relations: ['collection_data'] });
  }

  async getAllCollectionsByOwner(ownerId: string): Promise<Collection[]> {
    const workspacesByOwner = await this.workspaceRepository.findBy({
      owner_id: ownerId,
    });
    const workspacesIdsByOwner = workspacesByOwner.map(
      (workspace) => workspace.workspace_id,
    );
    return this.collectionRepository.find({
      where: { workspace_id: In(workspacesIdsByOwner) },
    });
  }
}
