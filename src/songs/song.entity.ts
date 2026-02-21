import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, Index } from 'typeorm';
import { Artist } from '../artists/entities/artist.entity';
import { Playlist } from 'src/playlists/entities/playlist.entity';

@Index('IDX_SONG_TITLE_DATE', ['title', 'releasedDate'])
@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  url: string;

  @Index('IDX_SONG_RELEASED_DATE')
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
