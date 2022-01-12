import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 104 })
  title: string;

  @Column({ length: 1024 })
  content: string;

  @ManyToOne(() => User, user => user.posts)
  author: User;

  @Column({ nullable: false })
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;
}