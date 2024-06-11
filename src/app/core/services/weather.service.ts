import { Injectable, Signal, effect, inject, signal } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CurrentConditions } from "../../models/current-conditions.type";
import { ConditionsAndZip } from "../../models/conditions-and-zip.type";
import { Forecast } from "../../models/forecast.type";
import { LocationService } from "./location.service";
import { CacheService } from "./cache.service";
import { ToastrService } from "ngx-toastr";

const CONDITION = "condition_";
const FORECAST = "forecast_";

@Injectable()
export class WeatherService {
  static readonly URL = "https://api.openweathermap.org/data/2.5";
  static readonly APPID = "fd10cc75dfe5b31e0ba9788dca2397aa";
  static readonly ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";

  private readonly _currentConditions = signal<ConditionsAndZip[]>([]);
  private readonly _http = inject(HttpClient);
  private readonly _locationService = inject(LocationService);
  private readonly _cacheService = inject(CacheService);
  private readonly _toastr = inject(ToastrService);

  constructor() {
    // sync locations with conditions
    // location can be used everywhere and update every other service
    effect(
      () => {
        const currentConditions = this._currentConditions().map((cc) => cc.zip);

        const locations = this._locationService.locations();

        locations.forEach((loc) => {
          if (!currentConditions.includes(loc)) {
            this.addCurrentConditions(loc);
          }
        });

        currentConditions.forEach((zip) => {
          if (!locations.includes(zip)) {
            this.removeCurrentConditions(zip);
          }
        });
      },
      { allowSignalWrites: true }
    );
  }

  private addCurrentConditions(zipcode: string): void {
    const cachedCondition: CurrentConditions = this._cacheService.getData(
      CONDITION + zipcode
    )?.data;

    // check if condition is cached
    if (cachedCondition) {
      this.updateConditions(zipcode, cachedCondition);
      return;
    }

    // get condition and cache it
    this._http
      .get<CurrentConditions>(
        `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`
      )
      .subscribe(
        (data) => {
          const condition: ConditionsAndZip = { zip: zipcode, data };
          this.saveInCache(CONDITION + zipcode, condition);
          this.updateConditions(zipcode, data);
        },
        (error: HttpErrorResponse) => {
          const message = `Error fetching weather data for zip code ${zipcode} : ${error.error.message}`;
          this._toastr.error(message, "Error!");
          console.info(message);
          this._locationService.removeLocation(zipcode);
        }
      );
  }

  private removeCurrentConditions(zipcode: string): void {
    this._currentConditions.update((conditions) =>
      conditions.filter((cc) => cc.zip !== zipcode)
    );
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this._currentConditions.asReadonly();
  }

  // get forecast information of selected city
  getForecast(zipcode: string): Observable<Forecast> {
    const cachedForecast: Forecast = this._cacheService.getData(
      FORECAST + zipcode
    );

    if (cachedForecast) {
      return of(cachedForecast);
    }

    // get forecast and cache it
    return this._http
      .get<Forecast>(
        `${WeatherService.URL}/forecast?zip=${zipcode},us&units=imperial&cnt=5&appid=${WeatherService.APPID}`
      )
      .pipe(tap((forecast) => this.saveInCache(FORECAST + zipcode, forecast)));
  }

  // update condition
  private updateConditions(zip: string, data: CurrentConditions) {
    this._currentConditions.update((conditions) => [
      ...conditions,
      { zip, data },
    ]);
  }

  // cache generic type (condition, forecast)
  private saveInCache<T>(key: string, data: T) {
    this._cacheService.setCachedData(key, data);
  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }
}
