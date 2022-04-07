import { Exclude } from "class-transformer";
import { User } from "src/user/user.entity";
import { Workspace } from "src/workspace/workspace.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  @Exclude()
  workspaceId: string;

  @ManyToOne(() => Workspace, workspace => workspace.cards, { onDelete: 'CASCADE' })
  workspace: Workspace;
}