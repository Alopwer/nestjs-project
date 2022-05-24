import { Exclude } from 'class-transformer';
import { Card } from 'src/card/card.entity';
import { User } from 'src/user/user.entity';
import { WorkspaceRelation } from 'src/workspaceRelation/workspaceRelation.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  workspace_id: string;

  @Column('varchar', { length: 60 })
  title: string;

  @Column()
  @Exclude()
  owner_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Card, (card) => card.workspace)
  cards: Card[];
}
