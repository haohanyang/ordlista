import { Component, OnDestroy, OnInit } from "@angular/core"
import AuthService from "./auth.service"
import { Subscription } from "rxjs"
import { MatBottomSheet } from "@angular/material/bottom-sheet"
import { InstallPwaPromptComponent, InstallPwaPromptData } from "./components/install-pwa-prompt/install-pwa-prompt.component"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  authSubscription$: Subscription
  isCheckingAuth = true
  promptEvent: any

  constructor(public auth: AuthService, private bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.isCheckingAuth = true
    this.authSubscription$ = this.auth.authenticationTrigger$.subscribe(user => {
      if (user) {
        this.auth.userIdSubject$.next(user.username as string)
      }
      this.isCheckingAuth = false
    })

    window.addEventListener('beforeinstallprompt', (event: any) => {
      event.preventDefault()
      console.log("beforeinstallprompt")
      this.promptEvent = event
      this.bottomSheet.open<InstallPwaPromptComponent, InstallPwaPromptData>(InstallPwaPromptComponent,
        {
          data: {
            promptEvent: this.promptEvent,
          }
        })
    })

    window.addEventListener("appinstalled", () => {
      console.log("afterinstallprompt")
      this.promptEvent = null
    })

  }
  ngOnDestroy() {
    this.authSubscription$.unsubscribe()
  }
}
