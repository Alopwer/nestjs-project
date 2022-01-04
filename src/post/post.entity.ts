import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 104 })
  title: string;

  @Column({ length: 1024 })
  content: string;
}