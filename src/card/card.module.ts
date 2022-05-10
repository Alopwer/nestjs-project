import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Workspace } from 'src/workspace/workspace.entity';
import { WorkspaceRelationsRepository } from 'src/workspaceRelation/repository/workspaceRelation.repository';
import { CardController } from './card.controller';
import { Card } from './card.entity';
import { CardService } from './card.service';
import { CardData } from './cardData.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, CardData, WorkspaceRelationsRepository, Workspace]),
    UserModule,
    AuthModule
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
