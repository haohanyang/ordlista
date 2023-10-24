import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { IonicModule } from '@ionic/angular'
import { Word, WordList } from 'src/app/lib/model'
import AuthService from 'src/app/service/auth.service'
import HttpService from 'src/app/service/http.service'

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class WordListComponent implements OnInit {

  list: WordList | null = null
  listError: string | null = null

  isFetchingWords = false
  fetchingWordsError: string | null = null

  words: Word[] | null = null
  
  constructor(private activatedRoute: ActivatedRoute, private httpService: HttpService,
    public authService: AuthService) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ listResult }) => {
      if (listResult.error) {
        this.listError = "Failed to load the list"
      } else {
        this.list = listResult.data
      }
    })

    if (this.list) {
      this.isFetchingWords = true
      this.httpService.getWords$(this.list.id).subscribe(
        {
          next: result => {
            this.words = result.words,
              this.isFetchingWords = false
          },
          error: err => {
            console.log(err)
            this.fetchingWordsError = "Failed to load words"
            this.isFetchingWords = false
          },
        }
      )
    }
  }

}
