import { Component, Input, OnInit } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
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
  @Input() addWordCallback: (word: Word) => void

  isAdding = false
  wordAdded = false

  constructor(private httpService: HttpService, private snackBar: MatSnackBar) {
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
    this.isAdding = true
    this.httpService.createWord$({ ...this.word, listId: this.listId, creatorId: this.userId })
      .subscribe({
        next: result => {
          this.isAdding = false
          this.wordAdded = true
          this.addWordCallback(result.word)
        },
        error: err => {
          this.snackBar.open("Error adding word", "Close", {
            duration: 5000,
            verticalPosition: "top",
            horizontalPosition: "right"
          })
          console.log(err)
          this.isAdding = false
        }
      })
  }
}
