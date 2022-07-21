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
import { CollectionData } from './collectionData.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  collection_id: string;

  @Column()
  title: string;

  @Column()
  @Exclude()
  workspace_id: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.collections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column()
  @Exclude()
  collection_data_id: string;

  @OneToOne(() => CollectionData, (collection_data) => collection_data.collection, { cascade: true })
  @JoinColumn({ name: 'collection_data_id' })
  collection_data: CollectionData;
}
