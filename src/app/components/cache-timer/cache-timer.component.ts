import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CacheService } from "app/core/services/cache.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-cache-timer",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./cache-timer.component.html",
  styleUrl: "./cache-timer.component.css",
})
export class CacheTimerComponent {
  private _cacheService = inject(CacheService);
  private _toastr = inject(ToastrService);

  setCachingTime(time: number) {
    if (time < 1) {
      return;
    }

    this._cacheService.setCacheDuration(time * 1000);
    const message = `Caching time successfully set to ${time} seconds`;
    this._toastr.success(message, "Saved!");
  }
}
