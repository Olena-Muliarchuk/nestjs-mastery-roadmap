import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Artist } from '../artists/entities/artist.entity';
import { Playlist } from 'src/playlists/entities/playlist.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'date' })
  releasedDate: Date;

  @Column({ type: 'time' })
  duration: string;

  @Column({ type: 'text', nullable: true })
  lyrics: string;

  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];

  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  playLists: Playlist[];
}
