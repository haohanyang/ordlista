import { Component } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import AuthService from "src/app/auth.service"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})
export class LogInComponent {
  isLoggingIn = false
  signInForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required)
  })

  constructor(public auth: AuthService, private router: Router, private snackBar: MatSnackBar) {
  }

  get email() {
    return this.signInForm.get("email") as FormControl<string>
  }

  get password() {
    return this.signInForm.get("password") as FormControl<string>
  }

  onSubmitLogin() {
    this.isLoggingIn = true
    this.auth.signIn(this.email.value, this.password.value)
      .subscribe({
        next: _result => {
          this.router.navigate(["/"])
        },
        error: error => {
          console.log(error)
          this.snackBar.open(error.message, "Close", {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "top",
          })
          this.isLoggingIn = false
        },
        complete: () => {
          this.isLoggingIn = false
        }
      })
  }
}
