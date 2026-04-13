import { Column, Entity, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '@app/contracts';
import { Playlist } from '@app/nest-zero-to-hero/playlists/entities/playlist.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  hashedRefreshToken: string | null;
}
