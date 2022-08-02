import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CoworkerRelationController } from './coworkerRelation.controller';
import { CoworkerRelationService } from './coworkerRelation.service';
import { AuthModule } from 'src/auth/auth.module';
import { CoworkerRelation } from './coworkerRelation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoworkerRelation]),
    UserModule,
    AuthModule,
  ],
  controllers: [CoworkerRelationController],
  providers: [CoworkerRelationService],
})
export class CoworkerRelationModule {}
