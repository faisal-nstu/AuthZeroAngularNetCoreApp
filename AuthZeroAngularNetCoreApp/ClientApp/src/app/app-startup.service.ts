import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthConfig } from './auth/auth-config';
import { throwError } from 'rxjs';

@Injectable()
export class AppStartupService {

  constructor(private http: HttpClient) {
  }

  loadConfig(): Promise<any> {
    const promise = this.http.get<AuthConfig>('./configuration/auth')
      .toPromise()
      .then(c => {
        localStorage.setItem('client_id', c.clientId);
        localStorage.setItem('domain', c.domain);
      })
      .catch((error: HttpErrorResponse) => {
        // Verify if server error occurred
        if (error.status !== 404) {
          return throwError('Failed to load application configuration.');
        }
      });

    return promise;
  }
}
