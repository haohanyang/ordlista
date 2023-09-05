import { Component, Inject } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"
import HttpService from "src/app/http.service"
import { Word } from "src/app/models/word"

export interface SearchWordModalData {
  listId: string
  userId: string
  addWordCallback: (word: Word) => void
}

@Component({
  selector: "app-search-word-modal",
  templateUrl: "./search-word-modal.component.html"
})
export class SearchWordModalComponent {
  formGroup = new FormGroup({
    keyword: new FormControl("", Validators.required)
  })

  searchResults: Word[] | null = null
  isSearching = false
  searchError: string | null = null

  constructor(private httpService: HttpService, @Inject(MAT_DIALOG_DATA) public data: SearchWordModalData) { }

  get keyword() {
    return this.formGroup.controls["keyword"]
  }

  searchWord() {
    if (this.keyword.value) {
      this.isSearching = true
      this.httpService.searchWord$(this.keyword.value.trim().toLowerCase())
        .subscribe({
          next: result => {
            this.searchResults = result.result
            this.isSearching = false
          },
          error: err => {
            this.searchError = "Error searching word"
            console.log(err)
            this.isSearching = false
          }
        })
    }
  }
}
