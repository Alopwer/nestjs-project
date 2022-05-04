import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';
import { CardService } from './card.service';
import { UpdateCardDto } from './dto/updateCard.dto';
import { UpdateCardDataDto } from './dto/updateCardData.dto';
import { CardEditorGuard } from './guard/cardEditor.guard';
import { CardOwnershipGuard } from './guard/cardOwnership.guard';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Put(':id')
  @UseGuards(CardOwnershipGuard)
  async updateCard(
    @Param('id', ParseUUIDPipe) cardId: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardService.updateCard(cardId, updateCardDto);
  }

  @Put(':id/details/:cardDataId')
  @UseGuards(CardEditorGuard)
  async updateCardData(
    @Param('cardDataId', ParseUUIDPipe) cardDataId: string,
    @Body() updateCardDataDto: UpdateCardDataDto,
  ) {
    return this.cardService.updateCardData(cardDataId, updateCardDataDto);
  }

  @Delete(':id')
  @UseGuards(CardOwnershipGuard)
  async deleteCard(@Param('id', ParseUUIDPipe) cardId: string) {
    return this.cardService.deleteCard(cardId);
  }
}
