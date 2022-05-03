import { Module } from "@nestjs/common";
import { SharedRelationService } from "./relation/relation.service";
import { SharedService } from "./shared.service";

@Module({
  providers: [SharedService, SharedRelationService],
  exports: [SharedService, SharedRelationService]
})
export class SharedModule {}