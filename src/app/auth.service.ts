import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { Auth } from "aws-amplify"
import { Observable, from, tap, map, catchError, of, BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root"
})
export default class AuthService {
  userIdSubject$ = new BehaviorSubject<string | null>(null)

  readonly authenticationTrigger$ =
    from(Auth.currentAuthenticatedUser()).pipe(
      catchError(_error => {
        return of(null)
      })
    )

  readonly isAuthenticated$ = this.authenticationTrigger$.pipe(
    map(result => !!result)
  )

  readonly userId$ = this.authenticationTrigger$.pipe(
    map(result => result ? result.username as string : null),
  )

  constructor(private router: Router) { }

  signUp(email: string, username: string, password: string): Observable<any> {
    return from(Auth.signUp({
      username: email,
      password: password,
      attributes: {
        preferred_username: username,
      }
    }))
  }

  confirmSignUp(email: string, code: string): Observable<any> {
    return from(Auth.confirmSignUp(email, code))
  }

  signIn(email: string, password: string): Observable<any> {
    return from(Auth.signIn(email, password))
      .pipe(
        tap((e) => {
          this.userIdSubject$.next(e.username)
        })
      )
  }

  logOut(): Observable<any> {
    return from(Auth.signOut()).pipe(tap(() => {
      this.userIdSubject$.next(null)
      this.router.navigate(["/"])
    }))
  }
}


