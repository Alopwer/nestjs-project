import { Exclude } from "class-transformer";
import { Post } from "src/post/post.entity";
import { Subscription } from "src/subscription/enum/subscription.enum";
import { UserSubscription } from "src/subscription/subscription.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;
  
  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @ManyToOne(() => UserSubscription, subscription => subscription.type)
  subscription: Subscription;
}