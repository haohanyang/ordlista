import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AlertController, IonicModule, ModalController } from "@ionic/angular";
import AuthService from "src/app/service/auth.service";

@Component({
  selector: "app-auth-modal",
  templateUrl: "./auth-modal.component.html",
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class AuthModalComponent {
  @Input() mode: "login" | "confirm" | "signup" = "login";
  isRequesting = false;
  maskedEmail = "";

  loginInForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required),
  });

  signUpForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });

  confirmForm: FormGroup = new FormGroup({
    confirmCode: new FormControl("", [Validators.required]),
  });

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService,
  ) {}

  cancel() {
    return this.modalController.dismiss();
  }

  signUp() {
    if (this.mode === "signup" && this.signUpForm.valid) {
      this.isRequesting = true;
      const { email, username, password } = this.signUpForm.value;
      this.authService.signUp$(email, username, password).subscribe({
        next: (result) => {
          this.maskedEmail = result.codeDeliveryDetails?.Destination || email;
          this.mode = "confirm";
          this.isRequesting = false;
        },
        error: async (error) => {
          const alert = await this.alertController.create({
            message: error.message || "Unkown error occurred",
            header: "Failed to sign up",
            buttons: ["OK"],
          });
          await alert.present();
          this.isRequesting = false;
        },
      });
    }
  }

  confirm() {
    if (this.mode == "confirm" && this.confirmForm.valid) {
      const { confirmCode } = this.confirmForm.value;
      const { email } = this.signUpForm.value;
      this.isRequesting = true;
      this.authService.confirmVerificationCode$(email, confirmCode).subscribe({
        next: () => {
          console.log("confirmed");
          this.isRequesting = false;
          this.cancel();
        },
        error: async (error) => {
          const alert = await this.alertController.create({
            message: error.message || "Unkown error occurred",
            header: "Failed to verify the code",
            buttons: ["OK"],
          });
          await alert.present();
          this.isRequesting = false;
        },
      });
    }
  }

  logIn() {
    if (this.loginInForm.valid) {
      const { email, password } = this.loginInForm.value;
      this.isRequesting = true;
      this.authService.logIn$(email, password).subscribe({
        next: async () => {
          console.log("logged in");
          this.isRequesting = false;
          this.cancel();
        },
        error: async (error) => {
          const alert = await this.alertController.create({
            message: error.message || "Unkown error occurred",
            header: "Failed to log in",
            buttons: ["OK"],
          });
          await alert.present();
          this.isRequesting = false;
        },
      });
    }
  }
}
