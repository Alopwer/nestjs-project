import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { FriendshipStatusCode } from "./enum/friendshipStatusCode.enum";
import { User } from "./user.entity";

@Entity('friendship')
export class FriendshipStatus {
  @PrimaryColumn()
  requesterId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  requester: string;

  @PrimaryColumn()
  addresseeId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  addressee: string;

  @Column({
    type: 'enum',
    enum: FriendshipStatusCode,
    default: null
  })
  statusCode: FriendshipStatusCode;
}