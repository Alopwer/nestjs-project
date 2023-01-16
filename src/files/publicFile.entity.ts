import { Exclude } from 'class-transformer';
import { Workspace } from 'src/workspace/workspace.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('public_files')
export class PublicFile {
  @PrimaryGeneratedColumn('uuid')
  public_file_id: string;

  @Column()
  url: string;

  @Column()
  key: string;

  @OneToOne(() => Workspace, { onDelete: 'CASCADE' })
  @Exclude()
  workspace_id: string;
}
