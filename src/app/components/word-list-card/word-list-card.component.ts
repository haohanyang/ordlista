import { Component, Input, OnInit } from "@angular/core"
import { WordList } from "../../models/wordlist"
import * as moment from "moment"

@Component({
  selector: "app-word-list-card",
  templateUrl: "./word-list-card.component.html",
})
export class WordlistcardComponent implements OnInit {
  @Input() list: WordList
  createdAt = ""
  constructor() {
  }

  ngOnInit() {
    moment.locale("sv")
    this.createdAt = moment(this.list.createdAt).format("MMMM D")
  }
}
