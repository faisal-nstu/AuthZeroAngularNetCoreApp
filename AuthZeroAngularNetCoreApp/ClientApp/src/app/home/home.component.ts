import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  welcomeText: string;
  constructor(public auth: AuthService) {
    this.welcomeText = 'You are logged out. Please click Login to use the app.';
    this.auth.userProfile$.pipe(
      tap(user => {
        if (user) {
          this.welcomeText = `Welcome ${this.makeNameCase(user.nickname)}`;
        }
      })
    ).subscribe();
  }

  ngOnInit(): void {
  }

  makeNameCase(nickname: string) {
    return nickname.split('.')
      .map(part => part[0].toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
}
