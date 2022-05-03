import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { User } from 'src/user/user.entity';
import { Workspace } from 'src/workspace/workspace.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('workspace_relations')
export class WorkspaceRelation {
  @PrimaryColumn()
  addressee_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'addressee_id' })
  addressee: User;

  @Column()
  requester_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @PrimaryColumn()
  workspace_id: string;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column({
    type: 'enum',
    enum: RelationsStatusCode,
    default: null,
  })
  status_code: RelationsStatusCode;
}
