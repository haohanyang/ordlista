import { Component } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { Title } from "@angular/platform-browser"
import { Router } from "@angular/router"
import AuthService from "src/app/auth.service"
import { LogoutModalComponent } from "../logout-modal/logout-modal.component"
import HttpService from "src/app/http.service"
import { map, of, switchMap } from "rxjs"

@Component({
    selector: "app-top-nav",
    templateUrl: "./top-nav.component.html",
})
export class TopNavComponent {
    constructor(private auth: AuthService, private titleService: Title, private router: Router,
        private dialog: MatDialog, private http: HttpService) {
    }

    userProfile$ = this.auth.userIdSubject$.pipe(
        switchMap(id => {
            if (id) {
                return this.http.getUserProfile$(id)
            }
            return of(null)
        }), map(result => result?.user)
    )


    get title() {
        return this.titleService.getTitle()
    }

    get backUrl() {
        if (this.router.url.match(/\/lists\/[a-z0-9-]+/)) {
            return "/my-lists"
        }
        return ""
    }

    goBack() {
        this.router.navigate([this.backUrl])
    }

    openLogoutModal() {
        this.dialog.open(LogoutModalComponent, {
            width: "400px"
        })
    }
}