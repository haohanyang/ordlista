import { Injectable } from "@angular/core"
import { Hub, Auth, Amplify } from "aws-amplify"
import { BehaviorSubject, Observable, from, map, tap, catchError, of } from "rxjs"

@Injectable({
  providedIn: "root"
})
export default class AuthService {
  userIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)

  constructor() {
    Amplify.configure({
      aws_cognito_region: "eu-north-1",
      aws_user_pools_id: import.meta.env.NG_APP_COGNITO_USER_POOL_ID,
      aws_user_pools_web_client_id: import.meta.env.NG_APP_COGNITO_USER_POOL_CLIENT_ID,
      aws_cognito_username_attributes: [
        "EMAIL"
      ]
    })


    this.getUserId().subscribe(userId => this.userIdSubject.next(userId))

    Hub.listen("auth", async ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          this.userIdSubject.next(data.username)
          break
        case "signOut":
          this.userIdSubject.next(null)
          break
        default:
          console.warn("Unhandled event: " + event)
      }
    })
  }

  getUserId(): Observable<string | null> {
    return from(Auth.currentAuthenticatedUser())
      .pipe(
        map(result => {
          return result.username
        }),
        catchError(error => {
          console.error(error)
          return of(null)
        })
      )
  }

  getIdToken(): Observable<string> {
    return from(Auth.currentSession())
      .pipe(
        map(result => {
          return result.getIdToken().getJwtToken()
        })
      )
  }

  signOut(callback: () => void) {
    from(Auth.signOut()).pipe(
      tap(() => {
        this.userIdSubject.next(null)
        callback()
      })
    )
  }
}


