import { Body, Controller, Delete, Param, ParseUUIDPipe, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwtAuth.guard";
import { CardService } from "./card.service";
import { UpdateCardDto } from "./dto/updateCard.dto";
import { CardOwnershipGuard } from "./guard/cardOwnership.guard";

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(
    private readonly cardService: CardService
  ) {}

  @Put(':id')
  @UseGuards(CardOwnershipGuard)
  async updateCard(@Param('id', ParseUUIDPipe) cardId: string, @Body() updateCardDto: UpdateCardDto) {
    return await this.cardService.updateCard(cardId, updateCardDto);
  }

  @Delete(':id')
  @UseGuards(CardOwnershipGuard)
  async deleteCard(@Param('id', ParseUUIDPipe) cardId: string) {
    return await this.cardService.deleteCard(cardId);
  }
}