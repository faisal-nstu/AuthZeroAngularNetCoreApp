import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthConfig } from './auth/auth-config';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private authConfig: AuthConfig;

  constructor(private http: HttpClient) {
  }

  loadConfig(): Promise<any> {
    console.log('--::--::--::--::--::--:: Getting configuration from API service');
    const promise = this.http.get<AuthConfig>('./configuration/auth')
      .toPromise()
      .then(c => {
        this.authConfig = c;
      })
      .catch((error: HttpErrorResponse) => {
        // Verify if server error occurred
        if (error.status !== 404) {
          return throwError('Failed to load application configuration.');
        }
      });

    return promise;
  }

  getConfig(): AuthConfig {
    console.log('--::--::--::--::--::--:: Getting configuration from LOCAL service');
    return this.authConfig;
  }
}
