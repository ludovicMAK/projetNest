import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';
import { Game } from '../../game/entities/game.entity';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Game, { eager: true, nullable: true })
  @JoinColumn({ name: 'gameId' })
  game!: Game | null;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  gameId!: string | null;

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
