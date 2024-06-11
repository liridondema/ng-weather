import {
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from "@angular/core";
import { CacheService } from "./cache.service";
import { ToastrService } from "ngx-toastr";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  private _locations: WritableSignal<string[]> = signal<string[]>([]);
  public readonly locations: Signal<string[]> = this._locations.asReadonly();

  private readonly _cacheService = inject(CacheService);
  private readonly _toastr = inject(ToastrService);

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
      this._toastr.info(message, "Location existing!");
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
