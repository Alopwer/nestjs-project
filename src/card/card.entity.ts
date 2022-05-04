import { Exclude } from 'class-transformer';
import { Workspace } from 'src/workspace/workspace.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardData } from './cardData.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  card_id: string;

  @Column()
  title: string;

  @Column()
  @Exclude()
  workspace_id: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.cards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column()
  card_data_id: string;

  @OneToOne(() => CardData, card_data => card_data.card, { cascade: true })
  @JoinColumn({ name: 'card_data_id' })
  card_data: CardData;
}
