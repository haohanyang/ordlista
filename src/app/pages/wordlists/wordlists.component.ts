import { Component, OnDestroy, OnInit } from "@angular/core"
import { FormControl, FormGroup } from "@angular/forms"
import HttpService from "../../http.service"
import { WordList } from "../../models/wordlist"
import { Subscription, of, switchMap } from "rxjs"
import { ActivatedRoute } from "@angular/router"

@Component({
  selector: "app-wordlists",
  templateUrl: "./wordlists.component.html"
})
export class WordlistsComponent implements OnInit, OnDestroy {
  userId: string | null = null

  listFormGroup = new FormGroup({
    name: new FormControl(""),
    description: new FormControl("")
  })

  wordLists: WordList[] | null = null

  // Fetch lists
  isFetchingLists = false
  fetchingListsError: string | null = null

  createNewListModalOpen = false
  subscription: Subscription | null = null

  constructor(private activatedRoute: ActivatedRoute, private httpService: HttpService) {
    this.closeCreateListModal = this.closeCreateListModal.bind(this)
    this.onNewListCreated = this.onNewListCreated.bind(this)
  }

  ngOnInit() {
    this.activatedRoute.data.pipe(switchMap(({ userId }) => {
      this.userId = userId
      if (userId) {
        this.isFetchingLists = true
        return this.httpService.getLists(userId)
      }
      return of(null)
    })).subscribe(result => {
      if (result) {
        if (result.error) {
          this.fetchingListsError = "Error fetching lists"
          console.error(result.error)
        } else {
          this.wordLists = result.data
        }
      }
      this.isFetchingLists = false
    })
  }

  get name() {
    return this.listFormGroup.controls["name"]
  }

  get description() {
    return this.listFormGroup.controls["description"]
  }

  closeCreateListModal() {
    this.createNewListModalOpen = false
  }

  onNewListCreated(list: WordList) {
    this.createNewListModalOpen = false
    this.wordLists?.push(list)
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
