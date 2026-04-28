import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tournament } from '../../tournament/entities/tournament.entity';
import { Player } from '../../player/entities/player.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tournament, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tournamentId' })
  tournament!: Tournament;

  @Column()
  @Exclude()
  tournamentId!: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player1Id' })
  player1!: Player;

  @Column()
  @Exclude()
  player1Id!: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player2Id' })
  player2!: Player;

  @Column()
  @Exclude()
  player2Id!: string;

  @ManyToOne(() => Player, { nullable: true })
  @JoinColumn({ name: 'winnerId' })
  winner!: Player | null;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  winnerId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  score!: string | null;

  @Column()
  round!: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  })
  status!: 'pending' | 'in_progress' | 'completed';
}
