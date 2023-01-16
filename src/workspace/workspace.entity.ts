import { Exclude } from 'class-transformer';
import { Collection } from 'src/collection/collection.entity';
import { PublicFile } from 'src/files/publicFile.entity';
import { User } from 'src/user/user.entity';
import { WorkspaceRelation } from 'src/workspaceRelation/workspaceRelation.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
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

  @OneToMany(() => Collection, (collection) => collection.workspace)
  collections: Collection[];

  @Column({
    nullable: true,
  })
  @Exclude()
  cover_image_id: string;

  @OneToOne(() => PublicFile, {
    nullable: true,
  })
  @JoinColumn({ name: 'cover_image_id' })
  cover_image?: PublicFile;
}
