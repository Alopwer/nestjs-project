import { Exclude } from "class-transformer";
import { Workspace } from "src/workspace/workspace.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("cards")
export class Card {
  @PrimaryGeneratedColumn('uuid')
  card_id: string;

  @Column()
  title: string;

  @Column()
  @Exclude()
  workspace_id: string;

  @ManyToOne(() => Workspace, workspace => workspace.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;
}