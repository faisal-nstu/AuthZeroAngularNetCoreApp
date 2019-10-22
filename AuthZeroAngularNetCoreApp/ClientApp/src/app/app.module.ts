import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { CallbackComponent } from './callback/callback.component';
import { AuthGuard } from './auth/auth.guard';
import { AppStartupService } from './app-startup.service';


//
// Application initialization
//
export function loadAppConfig(startupService: AppStartupService) {
  return () => startupService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent, canActivate: [AuthGuard] },
      { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthGuard] },
      { path: 'callback', component: CallbackComponent },
    ])
  ],
  providers: [
    AppStartupService,
    { provide: APP_INITIALIZER, useFactory: loadAppConfig, deps: [ AppStartupService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
