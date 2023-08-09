import { Component, Input, OnInit } from "@angular/core"
import HttpService from "src/app/http.service"
import { Word } from "src/app/models/word"

@Component({
  selector: "app-search-result-entry",
  templateUrl: "./search-result-entry.component.html",
})
export class SearchResultEntryComponent implements OnInit {
  @Input() word: Word
  @Input() listId: string
  @Input() userId: string
  @Input() addWordCallback: (word: Word, isImported: boolean) => void
  isRequesting = false
  requestError: string | null = null
  wordAdded = false

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.word.examples = this.word.examples.map(example => {
      const tempElement = document.createElement("div")
      tempElement.innerHTML = example
      const decodedExample = tempElement.textContent || tempElement.innerText || ""
      return decodedExample
    })
  }

  addWord() {
    this.isRequesting = true
    this.httpService.createWord({ ...this.word, listId: this.listId, creatorId: this.userId })
      .subscribe(result => {
        if (result.error) {
          this.requestError = "Error adding word"
          console.error(result.error)
        } else {
          this.wordAdded = true
          this.addWordCallback(result.data!, true)
        }
        this.isRequesting = false
      })
  }




}
