import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IonicModule, ModalController } from "@ionic/angular";
import { Auth } from "aws-amplify";
import { AuthModalComponent } from "src/app/components/auth/auth-modal.component";
import AuthService from "src/app/service/auth.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {
  userId: string | null = null;

  constructor(
    private modalController: ModalController,
    public authService: AuthService,
    private router: Router,
  ) {}

  async openLoginModal() {
    const modal = await this.modalController.create({
      component: AuthModalComponent,
    });
    await modal.present();
  }

  ngOnInit() {
    Auth.currentAuthenticatedUser()
      .then((e) => {
        this.authService.userIdSubject$.next(e.username);
        this.router.navigate(["/app"]);
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
