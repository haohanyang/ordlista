import { Component, Inject } from "@angular/core"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import HttpService from "src/app/http.service"

export interface DeleteModalData {
  dataType: string | null
  dataId: string | null
  dataName: string | null
  onSuccessCallback: ((id: string) => void)
}

@Component({
  selector: "app-delete-modal",
  templateUrl: "./delete-modal.component.html",
})
export class DeleteModalComponent {
  isRequesting = false

  constructor(private httpService: HttpService, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DeleteModalData, public dialogRef: MatDialogRef<DeleteModalComponent>) { }

  deleteData() {
    if (this.data.dataType == "list" && this.data.dataId) {
      this.isRequesting = true
      this.httpService.deleteList$(this.data.dataId).subscribe({
        next: _result => {
          this.isRequesting = false
          this.dialogRef.close()
          this.data.onSuccessCallback(this.data.dataId!)
        },
        error: error => {
          this.snackBar.open("Failed to delete the list", "Close", {
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "right"
          })
          console.log(error)
          this.isRequesting = false
        }
      })
    } else if (this.data.dataType == "word" && this.data.dataId) {
      this.isRequesting = true
      this.httpService.deleteWord$(this.data.dataId).subscribe({
        next: _result => {
          this.dialogRef.close()
          this.data.onSuccessCallback(this.data.dataId!)
          this.isRequesting = false
        },
        error: err => {
          this.snackBar.open("Failed to delete the word", "Close", {
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
