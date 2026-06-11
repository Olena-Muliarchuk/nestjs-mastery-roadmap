import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Artist } from 'src/artists/entities/artist.entity';
import { ArtistsService } from 'src/artists/artists.service';

@Injectable({ scope: Scope.REQUEST })
export class ArtistsLoader {
  public readonly batchArtists: DataLoader<number, Artist[]>;

  constructor(private readonly artistsService: ArtistsService) {
    this.batchArtists = new DataLoader<number, Artist[]>(async (songIds: readonly number[]) => {
      const map = await this.artistsService.findArtistsBySongIds([...songIds]);
      return songIds.map((id) => map.get(id) ?? []);
    });
  }
}
