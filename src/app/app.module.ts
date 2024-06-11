import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";

import { AppComponent } from "./app.component";
import { ZipcodeEntryComponent } from "./components/zipcode-entry/zipcode-entry.component";
import { LocationService } from "./core/services/location.service";
import { ForecastsListComponent } from "./components/forecasts-list/forecasts-list.component";
import { WeatherService } from "./core/services/weather.service";
import { CurrentConditionsComponent } from "./components/current-conditions/current-conditions.component";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { RouterModule } from "@angular/router";
import { routing } from "./app.routing";
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { TabsComponent } from "./shared/components/tabs/tabs.component";
import { TabDirective } from "./shared/directives/tab.directive";
import { CacheService } from "./core/services/cache.service";
import { CacheTimerComponent } from "./components/cache-timer/cache-timer.component";

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    routing,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production,
    }),
    TabsComponent,
    TabDirective,
    CacheTimerComponent,
  ],
  providers: [
    LocationService,
    WeatherService,
    CacheService,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
