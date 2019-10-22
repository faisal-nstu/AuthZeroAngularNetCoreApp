import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { AuthConfig } from './auth/auth-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  baseUrl: string;

  constructor(private auth: AuthService, private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.auth.localAuthSetup();
    // this.http.get<AuthConfig>(this.baseUrl + 'configuration/auth').subscribe(result => {
    //   const config = result;
    //   this.auth.auth0ClientSub$.next(config);
    // }, error => console.error(error));
  }
}
