import { Exclude } from "class-transformer";
import { Workspace } from "src/workspace/workspace.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
}