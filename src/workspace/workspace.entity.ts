import { Exclude } from "class-transformer";
import { Card } from "src/card/card.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 60 })
  title: string;

  @Column()
  @Exclude()
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => Card, card => card.workspace)
  cards: Card[];
}