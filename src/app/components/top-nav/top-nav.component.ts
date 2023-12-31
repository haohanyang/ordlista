import { Component } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { Title } from "@angular/platform-browser"
import { Router } from "@angular/router"
import AuthService from "src/app/auth.service"
import { LogoutModalComponent } from "../logout-modal/logout-modal.component"
import HttpService from "src/app/http.service"
import { InfoModalComponent } from "../info-modal/info-modal.component"

@Component({
  selector: "app-top-nav",
  templateUrl: "./top-nav.component.html",
})
export class TopNavComponent {
  promptEvent: any
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
    if (this.router.url === "/settings/profile") {
      return "/settings"
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

  openInfoModal() {
    this.dialog.open(InfoModalComponent, {
      width: "400px"
    })
  }
}