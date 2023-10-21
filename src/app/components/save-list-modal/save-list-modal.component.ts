import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { IonicModule, ModalController, ToastController } from "@ionic/angular";
import { WordList } from "src/app/lib/model";
import HttpService from "src/app/service/http.service";

@Component({
  selector: "app-save-list-modal",
  templateUrl: "./save-list-modal.component.html",
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class SaveListModalComponent implements OnInit {
  // @ts-ignore
  @Input() list: WordList | null;
  // @ts-ignore
  @Input() userId: string;
  // @ts-ignore
  @Input() onSuccessCallback: (list: WordList) => void;

  isRequesting = false;
  // @ts-ignore
  listFormGroup: FormGroup;

  constructor(
    private modalController: ModalController,
    private httpService: HttpService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.listFormGroup = new FormGroup({
      name: new FormControl(this.list?.name || "", [Validators.required]),
      description: new FormControl(this.list?.description || ""),
    });
  }

  cancel() {
    this.listFormGroup.reset();
    this.modalController.dismiss();
  }

  saveList() {
    if (this.listFormGroup.valid) {
      const { name, description } = this.listFormGroup.value;
      this.isRequesting = true;
      const observable = this.list
        ? this.httpService.updateList$({
            ...this.listFormGroup.value,
            id: this.list.id,
          })
        : this.httpService.createList$({
            id: "",
            name: name,
            description: description,
            wordCount: 0,
            creatorId: this.userId,
            createdAt: "",
          });
      observable.subscribe({
        next: (result) => {
          this.isRequesting = false;
          this.onSuccessCallback(result.list);
          this.modalController.dismiss();
          this.listFormGroup.reset();
        },
        error: (err) => {
          this.toastController
            .create({
              message: "Failed to save the list",
              duration: 3000,
              position: "bottom",
            })
            .then((toast) => toast.present());
          console.log(err);
          this.isRequesting = false;
        },
      });
    }
  }
}
