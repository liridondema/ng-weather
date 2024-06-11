import { Component, inject } from "@angular/core";
import { LocationService } from "../../core/services/location.service";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
})
export class ZipcodeEntryComponent {
  private _locationService = inject(LocationService);

  addLocation(zipcode: string) {
    this._locationService.addLocation(zipcode);
  }
}
