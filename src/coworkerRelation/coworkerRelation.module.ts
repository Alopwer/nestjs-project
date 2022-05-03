import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/user/user.module';
import { CoworkerRelationController } from './coworkerRelation.controller';
import { CoworkerRelationService } from './coworkerRelation.service';
import { CoworkerRelation } from './coworkerRelation.entity';
import { CoworkerRelationsRepository } from './repository/coworkerRelations.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([CoworkerRelation])
  ],
  controllers: [CoworkerRelationController],
  providers: [CoworkerRelationService, CoworkerRelationsRepository, AuthService],
})
export class CoworkerRelationModule {}
