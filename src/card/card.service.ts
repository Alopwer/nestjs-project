import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { UpdateCardDto } from './dto/updateCard.dto';
import { CreateCardData } from './interface/createCardData.interface';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async updateCard(cardId: string, updateCardDto: UpdateCardDto) {
    await this.cardRepository.update(cardId, updateCardDto);
    return this.cardRepository.findOne(cardId);
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

  async getAllWorkspaceCards(workspaceId: string): Promise<Card[]> {
    return this.cardRepository.find({ workspace_id: workspaceId });
  }

  async createCard(createCardData: CreateCardData): Promise<Card> {
    const newCard = this.cardRepository.create(createCardData);
    await this.cardRepository.save(newCard);
    return newCard;
  }
}
