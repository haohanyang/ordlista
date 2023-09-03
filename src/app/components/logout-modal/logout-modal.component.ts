import { Component } from "@angular/core"
import { MatDialogRef } from "@angular/material/dialog"
import AuthService from "src/app/auth.service"

@Component({
  selector: "app-logout-modal",
  templateUrl: "./logout-modal.component.html",
})
export class LogoutModalComponent {
  constructor(private auth: AuthService, private dialogRef: MatDialogRef<LogoutModalComponent>) { }
  logOut() {
    this.auth.logOut().subscribe(() => {
      this.dialogRef.close()
    })
  }
}
