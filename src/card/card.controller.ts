import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { CardService } from './card.service';
import { UpdateCardDto } from './dto/updateCard.dto';
import { UpdateCardDataDto } from './dto/updateCardData.dto';
import { CardMemberGuard } from './guard/cardMember.guard';
import { CardOwnershipGuard } from './guard/cardOwnership.guard';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  @UseGuards(CardOwnershipGuard)
  async getAllCardsByOwner(@Req() { user }: RequestWithUser) {
    return this.cardService.getAllCardsByOwner(user.user_id);
  }

  @Put(':id')
  @UseGuards(CardMemberGuard)
  async updateCard(
    @Param('id', ParseUUIDPipe) cardId: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardService.updateCard(cardId, updateCardDto);
  }

  @Put(':id/details/:cardDataId')
  @UseGuards(CardMemberGuard)
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
