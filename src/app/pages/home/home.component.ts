import { Component, OnDestroy } from "@angular/core"
import AuthService from "../../auth.service"
import { Subscription } from "rxjs"

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnDestroy {

  subscription: Subscription
  userId: string | null = null

  constructor(private authService: AuthService) {
    this.subscription = this.authService.userIdSubject.subscribe(async (userId) => {
      this.userId = userId
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
