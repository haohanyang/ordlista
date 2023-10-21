import { Injectable } from "@angular/core";
import { Auth } from "aws-amplify";
import {
  BehaviorSubject,
  Observable,
  catchError,
  from,
  map,
  of,
  tap,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export default class AuthService {
  userIdSubject$ = new BehaviorSubject<string | null>(null);

  readonly authenticationTrigger$ = from(Auth.currentAuthenticatedUser()).pipe(
    catchError((_error) => of(null)),
  );

  readonly isAuthenticated$ = this.authenticationTrigger$.pipe(
    map((result) => !!result),
  );

  readonly userId$ = this.authenticationTrigger$.pipe(
    map((result) => (result ? (result.username as string) : null)),
  );

  constructor() {
    Auth.currentAuthenticatedUser()
      .then((e) => {
        console.log(e);
        this.userIdSubject$.next(e.username);
      })
      .catch((e) => {
        console.log(e);
        this.userIdSubject$.next(null);
      });
  }

  logIn$(email: string, password: string): Observable<any> {
    return from(Auth.signIn(email, password)).pipe(
      tap((e) => {
        this.userIdSubject$.next(e.username);
      }),
    );
  }

  signUp$(email: string, username: string, password: string): Observable<any> {
    return from(
      Auth.signUp({
        username: email,
        password,
        attributes: {
          preferred_username: username,
        },
      }),
    );
  }

  confirmVerificationCode$(email: string, code: string): Observable<any> {
    return from(Auth.confirmSignUp(email, code));
  }

  logOut$(): Observable<any> {
    return from(Auth.signOut()).pipe(
      tap(() => {
        this.userIdSubject$.next(null);
      }),
    );
  }
}
