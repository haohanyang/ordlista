import { Component, Input } from "@angular/core"
import { FormControl, FormGroup } from "@angular/forms"
import HttpService from "src/app/http.service"
import { Word } from "src/app/models/word"

@Component({
  selector: "app-search-word-modal",
  templateUrl: "./search-word-modal.component.html"
})
export class SearchWordModalComponent {
  @Input() listId: string
  @Input() userId: string
  @Input() isActive: boolean
  @Input() closeCallback: () => void
  @Input() addWordCallback: (word: Word, isImported: boolean) => void

  formGroup = new FormGroup({
    keyword: new FormControl("")
  })

  searchResults: Word[] | null = null
  isRequesting = false
  requestError: string | null = null

  constructor(private httpService: HttpService) {
  }
  get keyword() {
    return this.formGroup.controls["keyword"]
  }

  searchWord() {
    if (this.keyword?.value) {
      this.isRequesting = true
      this.httpService.searchWord(this.keyword.value.trim().toLowerCase())
        .subscribe(result => {
          if (result.error) {
            this.requestError = "Error searching word"
            console.error(result.error)
          } else {
            this.searchResults = result.data!
          }
          this.isRequesting = false
        })
    }
  }


}
