import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Index } from 'typeorm';
import { Song } from '../../songs/song.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  name!: string;

  @ManyToMany(() => Song, (song) => song.artists)
  songs!: Song[];
}
