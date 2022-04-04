import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 60 })
  title: string;

  @Column({ nullable: true })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.workspaces)
  owner: User;
}