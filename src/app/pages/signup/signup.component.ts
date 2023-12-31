import { Component } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import AuthService from "src/app/auth.service"

@Component({
  selector: "app-sign-up",
  templateUrl: "./signup.component.html",
})
export class SignUpComponent {

  signUpForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    username: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)])
  })
  confirmationForm: FormGroup = new FormGroup({
    confirmationCode: new FormControl("", Validators.required)
  })

  accountCreated = false
  maskedEmail = ""

  isSigningUp = false
  isConfirming = false

  constructor(private auth: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  get email() {
    return this.signUpForm.get("email") as FormControl<string>
  }

  get password() {
    return this.signUpForm.get("password") as FormControl<string>
  }

  get username() {
    return this.signUpForm.get("username") as FormControl<string>
  }

  get confirmationCode() {
    return this.confirmationForm.get("confirmationCode") as FormControl
  }

  onSubmitSignup() {
    this.isSigningUp = true
    this.auth.signUp(this.email.value, this.username.value, this.password.value)
      .subscribe({
        next: result => {
          this.accountCreated = true
          this.maskedEmail = result.codeDeliveryDetails?.Destination || ""
          this.isSigningUp = false
        },
        error: error => {
          console.log(error)
          this.isSigningUp = false
          this.snackBar.open(error.message, "Close", {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "top",
          })
          this.isSigningUp = false
        },
        complete: () => {
          this.router.navigate(["/login"])
        }
      })
  }

  onSubmitConfirmation() {
    this.isConfirming = true
    this.auth.confirmSignUp(this.email.value, this.confirmationCode.value)
      .subscribe({
        next: _result => {
          this.isConfirming = true
          this.router.navigate(["/login"])
        }, error: error => {
          console.log(error)
          this.isConfirming = false
          this.snackBar.open(error.message, "Close", {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "top",
          })
          this.isConfirming = true
        }
      })
  }
}