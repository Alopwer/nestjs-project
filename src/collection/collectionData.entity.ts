import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection.entity';

@Entity('collections_data')
export class CollectionData {
  @PrimaryGeneratedColumn('uuid')
  collection_data_id: string;

  @Column()
  description: string;

  @OneToOne(() => Collection, (collection) => collection.collection_id, {
    onDelete: 'CASCADE',
  })
  collection: Collection;
}
