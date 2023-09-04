import { Component } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { Title } from "@angular/platform-browser"
import { Router } from "@angular/router"
import AuthService from "src/app/auth.service"
import { LogoutModalComponent } from "../logout-modal/logout-modal.component"
import HttpService from "src/app/http.service"

@Component({
    selector: "app-top-nav",
    templateUrl: "./top-nav.component.html",
})
export class TopNavComponent {
    constructor(public auth: AuthService, private titleService: Title, private router: Router,
        private dialog: MatDialog, public http: HttpService) {
    }

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