import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthConfig } from './auth-config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loggedIn: boolean = null;
    // Create subject and public observable of user profile data
    private userProfileSubject$ = new BehaviorSubject<any>(null);
    userProfile$ = this.userProfileSubject$.asObservable();

    // config
    config: AuthConfig = {
        clientId: localStorage.getItem('client_id'),
        domain: localStorage.getItem('domain'),
    };

    // Create an observable of Auth0 instance of client
    auth0Client$ = (from(
        createAuth0Client({
            domain: this.config.domain,
            client_id: this.config.clientId,
            redirect_uri: `${window.location.origin}/callback`
        })
    ) as Observable<Auth0Client>).pipe(
        shareReplay(1), // Every subscription receives the same shared value
        catchError(err => throwError(err))
    );

    isAuthenticated$ = this.auth0Client$.pipe(
        concatMap((client: Auth0Client) => from(client.isAuthenticated())),
        tap(res => this.loggedIn = res)
    );

    handleRedirectCallback$ = this.auth0Client$.pipe(
        concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
    );

    constructor(private router: Router) { }

    private getUser$(options?): Observable<any> {
        return this.auth0Client$.pipe(
            concatMap((client: Auth0Client) => from(client.getUser(options))),
            tap(user => this.userProfileSubject$.next(user))
        );
    }

    localAuthSetup() {
        const checkAuth$ = this.isAuthenticated$.pipe(
            concatMap((loggedIn: boolean) => {
                if (loggedIn) {
                    return this.getUser$();
                }
                return of(loggedIn);
            })
        );

        checkAuth$.subscribe((response: { [key: string]: any } | boolean) => {
            this.loggedIn = !!response;
        });
    }

    login(redirectionPath: string = '/') {
        this.auth0Client$.subscribe((client: Auth0Client) => {
            client.loginWithRedirect({
                redirect_uri: `${window.location.origin}/callback`,
                appState: { target: redirectionPath }
            });
        });
    }

    handleAuthCallback() {
        // Only the callback component should call this method
        // Call when app reloads after user logs in with Auth0
        let targetRoute: string; // Path to redirect to after login processsed
        const authComplete$ = this.handleRedirectCallback$.pipe(
            // Have client, now call method to handle auth callback redirect
            tap(cbRes => {
                // Get and set target redirect route from callback results
                targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
            }),
            concatMap(() => {
                // Redirect callback complete; get user and login status
                return combineLatest(
                    [this.getUser$(),
                    this.isAuthenticated$]
                );
            })
        );
        // Subscribe to authentication completion observable
        // Response will be an array of user and login status
        authComplete$.subscribe(([user, loggedIn]) => {
            // Redirect to target route after callback processing
            this.router.navigate([targetRoute]);
        });
    }

    logout() {
        // Ensure Auth0 client instance exists
        this.auth0Client$.subscribe((client: Auth0Client) => {
            // Call method to log out
            client.logout({
                client_id: this.config.clientId,
                returnTo: `${window.location.origin}`
            });
        });
    }
}
