import { Component, inject } from "@angular/core";
import { WeatherService } from "../../core/services/weather.service";
import { ActivatedRoute } from "@angular/router";
import { Forecast } from "../../models/forecast.type";

@Component({
  selector: "app-forecasts-list",
  templateUrl: "./forecasts-list.component.html",
  styleUrls: ["./forecasts-list.component.css"],
})
export class ForecastsListComponent {
  private _zipcode: string = "";
  forecast: Forecast | undefined;

  protected weatherService = inject(WeatherService);
  private _route = inject(ActivatedRoute);

  constructor() {
    this._route.params.subscribe((params) => {
      this._zipcode = params["zipcode"];
      this.weatherService
        .getForecast(this._zipcode)
        .subscribe((data) => (this.forecast = data));
    });
  }
}
