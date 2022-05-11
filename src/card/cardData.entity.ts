import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from './card.entity';

@Entity('cards_data')
export class CardData {
  @PrimaryGeneratedColumn('uuid')
  card_data_id: string;

  @Column()
  description: string;

  @OneToOne(() => Card, (card) => card.card_id, { onDelete: 'CASCADE' })
  card: Card;
}
