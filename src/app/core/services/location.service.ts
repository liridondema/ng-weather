import {
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from "@angular/core";
import { CacheService } from "./cache.service";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  private _locations: WritableSignal<string[]> = signal<string[]>([]);
  public readonly locations: Signal<string[]> = this._locations.asReadonly();

  private _cacheService = inject(CacheService);

  constructor() {
    // load locations from cache
    let locations = this._cacheService.getData(LOCATIONS);
    if (locations) {
      this._locations.set(locations);
    }
  }

  addLocation(zipcode: string): void {
    const locations = [...this._locations()];
    if (locations.includes(zipcode)) {
      const message = `The zip code ${zipcode} is already added.`;
      console.info(message);
    } else {
      this.updateLocations([...this._locations(), zipcode]);
    }
  }

  removeLocation(zipcode: string): void {
    const locations = this._locations().filter(
      (location) => location !== zipcode
    );
    this.updateLocations(locations);
  }

  private updateLocations(locations: string[]): void {
    this._locations.set(locations);
    this._cacheService.setData(LOCATIONS, locations);
  }
}
