import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  game!: string;

  @Column()
  maxPlayers!: number;

  @Column()
  startDate!: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  })
  status!: 'pending' | 'in_progress' | 'completed';

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToMany(() => Player, (player) => player.tournaments)
  @JoinTable()
  players!: Player[];
}
