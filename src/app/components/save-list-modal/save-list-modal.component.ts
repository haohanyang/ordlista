import { Component, Inject, OnInit } from "@angular/core"
import { FormControl, FormGroup } from "@angular/forms"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import HttpService from "src/app/http.service"
import { WordList } from "src/app/models/wordlist"

export interface SaveListModalData {
  list: WordList | null
  userId: string | null
  onSuccessCallback: ((list: WordList) => void)
}

@Component({
  selector: "app-save-list-modal",
  templateUrl: "./save-list-modal.component.html"
})
export class SaveListModalComponent implements OnInit {

  isRequesting = false
  listFormGroup: FormGroup

  constructor(private httpService: HttpService, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<SaveListModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SaveListModalData) { }

  ngOnInit() {
    this.listFormGroup = new FormGroup({
      name: new FormControl(this.data.list?.name || ""),
      description: new FormControl(this.data.list?.description || "")
    })
  }

  get name() {
    return this.listFormGroup.controls["name"]
  }

  get description() {
    return this.listFormGroup.controls["description"]
  }

  saveList() {

    if (this.data.userId && this.name.value && this.description.value) {
      this.isRequesting = true

      const observable = this.data.list ? this.httpService.updateList$({ ...this.listFormGroup.value, id: this.data.list.id })
        : this.httpService.createList$({
          id: "",
          name: this.name.value,
          description: this.description.value,
          wordCount: 0,
          creatorId: this.data.userId,
          createdAt: ""
        })
      observable.subscribe({
        next: result => {
          this.isRequesting = false
          this.data.onSuccessCallback(result.list)
          this.dialogRef.close()
          this.listFormGroup.reset()
        },
        error: err => {
          this.snackBar.open("Failed to save the list", "Close", {
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "right"
          })
          console.log(err)
          this.isRequesting = false
        }
      })
    }
  }
}
