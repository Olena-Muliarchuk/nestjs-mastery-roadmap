import { Song } from '@app/nest-zero-to-hero/songs/song.entity';
import { User } from '@app/nest-zero-to-hero/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('playlist')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.playlists)
  @Index()
  user: User;

  @ManyToMany(() => Song)
  @JoinTable({ name: 'playlist_songs' })
  songs: Song[];
}
