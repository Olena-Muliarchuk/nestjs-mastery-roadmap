import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Song } from '../../songs/song.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Song, (song) => song.artists)
  songs: Song[];
}
