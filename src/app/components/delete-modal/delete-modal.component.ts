import { Component, Input } from "@angular/core"
import HttpService from "src/app/http.service"

@Component({
  selector: "app-delete-modal",
  templateUrl: "./delete-modal.component.html",
})
export class DeleteModalComponent {
  @Input() isActive = false
  @Input() dataType: string | null
  @Input() dataId: string | null
  @Input() dataName: string | null
  @Input() closeCallback: (() => void)
  @Input() onSuccessCallback: ((id: string) => void)

  isRequesting = false
  requestError: string | null = null

  constructor(private httpService: HttpService) { }

  deleteData() {
    if (this.dataType == "list" && this.dataId) {
      this.isRequesting = true
      this.httpService.deleteList(this.dataId).subscribe(result => {
        if (result.error) {
          console.error(result.error)
          this.requestError = "Error deleting list"
        } else {
          this.onSuccessCallback(this.dataId!)
        }
        this.isRequesting = false
      })
    } else if (this.dataType == "word" && this.dataId) {
      this.isRequesting = true
      this.httpService.deleteWord(this.dataId).subscribe(result => {
        if (result.error) {
          console.error(result.error)
          this.requestError = "Error deleting word"
        } else {
          this.onSuccessCallback(this.dataId!)
        }
        this.isRequesting = false
      })
    }
  }


}
