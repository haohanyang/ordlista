import { Component, OnDestroy } from "@angular/core"
import AuthService from "./auth.service"
import { Subject, Subscription, of, switchMap, takeUntil } from "rxjs"
import HttpService, { HttpServiceResponse } from "./http.service"
import { User } from "./models/user"
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from "@angular/router"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnDestroy {
  isMenuCollapsed = true;
  user: User | null = null;
  userSubscription: Subscription | null = null;
  menuActive = false;
  userDropdownActive = false;
  isResolvingRoute = false;
  routerUnsubscribe = new Subject<void>();

  constructor(private authService: AuthService, private httpService: HttpService, private router: Router) {
    this.userSubscription = this.authService.getUserId().pipe(switchMap(userId => {
      if (userId) {
        return this.httpService.getUserProfile(userId)
      }
      const data: HttpServiceResponse<User> = { data: null, error: null }
      return of(data)
    })).subscribe(result => {
      if (result.data) {
        this.user = result.data
      }
    })

    this.router.events.pipe(takeUntil(this.routerUnsubscribe))
      .subscribe((routerEvent) => {
        this.checkRouterEvent(routerEvent as RouterEvent)
      })
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.isResolvingRoute = true
    }
    if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.isResolvingRoute = false
    }
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe()
    this.routerUnsubscribe.next()
  }

  signOut() {
    this.authService.signOut(() => {
      this.user = null
      this.router.navigate(["/"])
    })
  }
}
