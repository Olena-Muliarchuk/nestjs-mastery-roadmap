import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, Index } from 'typeorm';
import { Artist } from '../artists/entities/artist.entity';
import { Playlist } from '@app/nest-zero-to-hero/playlists/entities/playlist.entity';

export enum SongStatus {
  PROCESSING = 'processing',
  ACTIVE = 'active',
  FAILED = 'failed',
}

@Index('IDX_SONG_TITLE_DATE', ['title', 'releasedDate'])
@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })
  storageKey: string;

  @Index('IDX_SONG_RELEASED_DATE')
  @Column({ type: 'date' })
  releasedDate: Date;

  @Column({ type: 'time', nullable: true })
  duration: string;

  @Column({ type: 'text', nullable: true })
  lyrics: string;

  @Column({
    type: 'enum',
    enum: SongStatus,
    default: SongStatus.PROCESSING,
  })
  status: SongStatus;

  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];

  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  playLists: Playlist[];
}
