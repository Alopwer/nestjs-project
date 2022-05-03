import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CoworkerRelationController } from './coworkerRelation.controller';
import { CoworkerRelationService } from './coworkerRelation.service';
import { CoworkerRelationsRepository } from './repository/coworkerRelations.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoworkerRelationsRepository]),
    UserModule,
    AuthModule,
  ],
  controllers: [CoworkerRelationController],
  providers: [CoworkerRelationService],
})
export class CoworkerRelationModule {}
