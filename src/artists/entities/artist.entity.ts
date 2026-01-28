import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Song } from '../../songs/song.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Song, (song) => song.artist)
  songs: Song[];
}
