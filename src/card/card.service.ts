import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { Workspace } from 'src/workspace/workspace.entity';
import { WorkspaceRelationsRepository } from 'src/workspaceRelation/repository/workspaceRelation.repository';
import { In, Repository } from 'typeorm';
import { Card } from './card.entity';
import { CardData } from './cardData.entity';
import { UpdateCardDto } from './dto/updateCard.dto';
import { UpdateCardDataDto } from './dto/updateCardData.dto';
import { CreateCardData } from './interface/createCardData.interface';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(CardData)
    private readonly cardDataRepository: Repository<CardData>,
    private readonly workspaceRelationsRepository: WorkspaceRelationsRepository,
  ) {}

  async createCard(createCardData: CreateCardData): Promise<Card> {
    const cardData = this.cardDataRepository.create({
      description: createCardData.description,
    });
    const newCard = this.cardRepository.create({
      ...createCardData,
      card_data: cardData,
    });
    await this.cardRepository.save(newCard);
    return newCard;
  }

  async updateCard(cardId: string, updateCardDto: UpdateCardDto) {
    await this.cardRepository.update(cardId, updateCardDto);
    return this.cardRepository.findOne(cardId);
  }

  async updateCardData(
    cardDataId: string,
    updateCardDataDto: UpdateCardDataDto,
  ) {
    await this.cardDataRepository.update(cardDataId, updateCardDataDto);
    return this.cardDataRepository.findOne(cardDataId);
  }

  async deleteCard(cardId: string) {
    await this.cardRepository.delete(cardId);
    return cardId;
  }

  async checkOwner(userId: string, cardId: string) {
    const card = await this.cardRepository.findOne(cardId, {
      relations: ['workspace'],
    });
    return card.workspace.owner_id === userId;
  }

  async checkMember(userId: string, cardId: string) {
    const card = await this.cardRepository.findOne(cardId, {
      relations: ['workspace'],
    });
    const workspaceRelation = await this.workspaceRelationsRepository
      .createQueryBuilder('workspace_relations')
      .where('addressee_id = :userId', { userId })
      .andWhere('workspace_id = :workspaceId AND status_code = :statusCode', {
        workspaceId: card.workspace_id,
        statusCode: RelationsStatusCode.Accepted,
      })
      .getOne();
    return workspaceRelation;
  }

  async getAllWorkspaceCards(workspaceId: string): Promise<Card[]> {
    return this.cardRepository.find({ where: { workspace_id: workspaceId } });
  }

  async getAllCardsByOwner(ownerId: string): Promise<Card[]> {
    const workspacesByOwner = await this.workspaceRepository.find({
      owner_id: ownerId,
    });
    const workspacesIdsByOwner = workspacesByOwner.map(
      (workspace) => workspace.workspace_id,
    );
    return this.cardRepository.find({
      where: { workspace_id: In(workspacesIdsByOwner) },
    });
  }
}
