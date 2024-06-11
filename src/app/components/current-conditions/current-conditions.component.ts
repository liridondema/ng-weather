import { Component, inject, Signal } from "@angular/core";
import { WeatherService } from "../../core/services/weather.service";
import { LocationService } from "../../core/services/location.service";
import { Router } from "@angular/router";
import { ConditionsAndZip } from "../../models/conditions-and-zip.type";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
})
export class CurrentConditionsComponent {
  private _router = inject(Router);
  private _locationService = inject(LocationService);

  protected weatherService = inject(WeatherService);
  // get all conditions and show tabs based on them
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> =
    this.weatherService.getCurrentConditions();

  protected showForecast(zipcode: string) {
    this._router.navigate(["/forecast", zipcode]);
  }

  // when tab is closed, location will be removed
  protected removeLocation(zipcode: string) {
    this._locationService.removeLocation(zipcode);
  }
}
