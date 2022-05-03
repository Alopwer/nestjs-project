import { RelationsStatusCode } from 'src/shared/relation/enum/relationsStatusCode.enum';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('coworker_relations')
export class CoworkerRelation {
  @PrimaryColumn()
  requester_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @PrimaryColumn()
  addressee_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'addressee_id' })
  addressee: User;

  @Column({
    type: 'enum',
    enum: RelationsStatusCode,
    default: null,
  })
  status_code: RelationsStatusCode;
}
