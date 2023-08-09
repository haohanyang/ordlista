import { Component, Input, OnInit } from "@angular/core"
import { FormControl, FormGroup } from "@angular/forms"
import HttpService from "src/app/http.service"
import { WordList } from "src/app/models/wordlist"

@Component({
  selector: "app-save-list-modal",
  templateUrl: "./save-list-modal.component.html"
})
export class SaveListModalComponent implements OnInit {
  @Input() isActive = false
  @Input() list: WordList | null
  @Input() userId: string | null = null
  @Input() onSuccessCallback: ((list: WordList) => void) // Callback after list is created
  @Input() closeCallback: (() => void)

  isRequesting = false
  requestError: string | null = null
  listFormGroup: FormGroup

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.listFormGroup = new FormGroup({
      name: new FormControl(this.list?.name || ""),
      description: new FormControl(this.list?.description || "")
    })
  }

  get name() {
    return this.listFormGroup.controls["name"]
  }

  get description() {
    return this.listFormGroup.controls["description"]
  }

  saveList() {
    if (this.userId && this.name.value && this.description.value) {
      this.isRequesting = true

      const observable = this.list ? this.httpService.updateList({ ...this.listFormGroup.value, id: this.list.id })
        : this.httpService.createList({
          id: "",
          name: this.name.value,
          description: this.description.value,
          wordCount: 0,
          creatorId: this.userId,
          createdAt: ""
        })
      observable.subscribe(result => {
        if (result.error) {
          this.requestError = "Error saving list"
          console.error(result.error)
        } else {
          this.onSuccessCallback(result.data!)
          this.listFormGroup.reset()
        }
        this.isRequesting = false
      })
    }
  }
}
