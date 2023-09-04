import { Component, OnDestroy, OnInit } from "@angular/core"
import AuthService from "./auth.service"
import { Subscription } from "rxjs"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
    authSubscription$: Subscription
    isCheckingAuth = true
    constructor(public auth: AuthService) {
    }

    ngOnInit() {
        this.isCheckingAuth = true
        this.authSubscription$ = this.auth.authenticationTrigger$.subscribe(() => {
            this.isCheckingAuth = false
        })
    }
    ngOnDestroy() {
        this.authSubscription$.unsubscribe()
    }
}
