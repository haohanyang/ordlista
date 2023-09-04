import { Component, OnInit } from "@angular/core"
import AuthService from "./auth.service"
import { Observable } from "rxjs"
import { Router } from "@angular/router"
import { Title } from "@angular/platform-browser"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {
    constructor(public auth: AuthService) {
    }
}
