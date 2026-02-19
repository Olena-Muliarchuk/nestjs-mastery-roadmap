import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../songs/song.entity';
import { Artist } from '../artists/entities/artist.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(Artist) private artistRepo: Repository<Artist>,
  ) {}

  async seed() {
    this.logger.log('🌱 Starting database seeding...');

    const count = await this.songRepo.count();
    if (count > 0) {
      this.logger.warn('⚠️ Database already contains data. Seeding skipped.');
      return;
    }

    const artistsData = ['Imagine Dragons', 'OneRepublic', 'Adele', 'Sia', 'The Beatles'];
    const savedArtists: Artist[] = [];

    for (const name of artistsData) {
      const artist = this.artistRepo.create({ name });
      savedArtists.push(await this.artistRepo.save(artist));
    }
    this.logger.log(`✅ Created ${savedArtists.length} artists`);

    for (let i = 1; i <= 20; i++) {
      const randomArtist = savedArtists[Math.floor(Math.random() * savedArtists.length)];

      const song = this.songRepo.create({
        title: `Awesome Track ${i}`,
        releasedDate: new Date(`202${Math.floor(Math.random() * 5)}-01-01`),
        duration: '03:30',
        url: `/uploads/dummy-song-${i}.mp3`,
        artists: [randomArtist],
      });

      await this.songRepo.save(song);
    }

    this.logger.log('✅ Created 20 songs');
    this.logger.log('🎉 Seeding completed successfully!');
  }
}
