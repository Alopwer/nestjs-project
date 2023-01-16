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
import { CollectionService } from './collection.service';
import { UpdateCollectionDto } from './dto/updateCollection.dto';
import { UpdateCollectionDataDto } from './dto/updateCollectionData.dto';
import { CollectionMemberGuard } from './guard/collectionMember.guard';
import { CollectionOwnershipGuard } from './guard/collectionOwnership.guard';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  @UseGuards(CollectionOwnershipGuard)
  async getAllCollectionsByOwner(@Req() { user }: RequestWithUser) {
    return this.collectionService.getAllCollectionsByOwner(user.user_id);
  }

  @Put(':id')
  @UseGuards(CollectionMemberGuard)
  async updateCollection(
    @Param('id', ParseUUIDPipe) collectionId: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionService.updateCollection(
      collectionId,
      updateCollectionDto,
    );
  }

  @Put(':id/details/:collectionDataId')
  @UseGuards(CollectionMemberGuard)
  async updateCollectionData(
    @Param('collectionDataId', ParseUUIDPipe) collectionDataId: string,
    @Body() updateCollectionDataDto: UpdateCollectionDataDto,
  ) {
    return this.collectionService.updateCollectionData(
      collectionDataId,
      updateCollectionDataDto,
    );
  }

  @Delete(':id')
  @UseGuards(CollectionOwnershipGuard)
  async deleteCollection(@Param('id', ParseUUIDPipe) collectionId: string) {
    return this.collectionService.deleteCollection(collectionId);
  }
}
