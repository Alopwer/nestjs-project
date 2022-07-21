import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Workspace } from 'src/workspace/workspace.entity';
import { WorkspaceRelationsRepository } from 'src/workspaceRelation/repository/workspaceRelation.repository';
import { CollectionController } from './collection.controller';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { CollectionData } from './collectionData.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Collection,
      CollectionData,
      WorkspaceRelationsRepository,
      Workspace,
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
