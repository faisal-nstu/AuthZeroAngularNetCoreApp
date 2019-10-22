import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  currentUser: any;
  userImage: string;

  constructor(public auth: AuthService) {
    this.auth.userProfile$.pipe(
      tap(profile => this.userImage = profile && profile.picture)
    ).subscribe();
  }

  ngOnInit() {
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }
}
