import { User } from 'src/user/user.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PostLimit } from './enum/postLimit.enum';
import { Subscription } from './enum/subscription.enum';

@Entity()
export class UserSubscription {
  @PrimaryColumn({ default: Subscription.Free })
  type: Subscription;
 
  @Column({ default: PostLimit.Ten })
  postingLimit: PostLimit;

  @OneToMany(() => User, user => user.id)
  user: User;
}