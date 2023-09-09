import { Component } from "@angular/core"
import { catchError, map, of, switchMap } from "rxjs"
import AuthService from "src/app/auth.service"
import HttpService from "src/app/http.service"

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
})
export class SettingsComponent {
  userProfileError: string | null = null
  constructor(public http: HttpService, private auth: AuthService) {
  }

  userProfile$ = this.auth.userIdSubject$.pipe(switchMap(userId => this.http.getUserProfile$(userId!)),
    map(result => result.user), catchError(error => {
      console.log(error)
      this.userProfileError = "Failed to fetch user profile"
      return of(null)
    }))

}
