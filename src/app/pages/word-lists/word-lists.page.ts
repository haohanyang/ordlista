import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  ActionSheetController,
  IonicModule,
  ModalController,
} from "@ionic/angular";

import { WordList, WordListGroupNode } from "../../lib/model";
import HttpService from "src/app/service/http.service";
import AuthService from "src/app/service/auth.service";
import * as moment from "moment";
import { SaveListModalComponent } from "src/app/components/save-list-modal/save-list-modal.component";
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-tab1",
  templateUrl: "word-lists.page.html",
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class WordListsPage implements OnInit {
  isRequesting = false;
  requestError: string | null = null;
  listsHead: WordListGroupNode | null = null;
  userId: string | null = null;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
  ) {
    this.addList = this.addList.bind(this);
  }

  ngOnInit() {
    this.authService.userIdSubject$.subscribe({
      next: (userId) => {
        this.userId = userId;
      },
    });

    if (this.userId) {
      this.isRequesting = true;
      this.httpService.getLists$(this.userId).subscribe({
        next: (result) => {
          const wordLists = result.lists;
          let header: WordListGroupNode = WordListGroupNode.dummy();
          let cur: WordListGroupNode = header;
          for (let i = wordLists.length - 1; i >= 0; i--) {
            if (
              !cur.isHeader &&
              cur.date.isSame(wordLists[i].createdAt, "month")
            ) {
              cur.lists.push(wordLists[i]);
            } else {
              cur.next = new WordListGroupNode(wordLists[i]);
              cur = cur.next;
            }
          }
          this.listsHead = header;
          this.isRequesting = false;
        },
        error: (error) => {
          console.log(error);
          this.requestError = error.message || "Failed to load word lists";
          this.isRequesting = false;
        },
      });
    }
  }

  wordLists(wordListNodeHeader: WordListGroupNode) {
    let cur: WordListGroupNode | null = wordListNodeHeader.next;
    const wordLists: WordList[][] = [];
    while (cur) {
      wordLists.push(cur.lists);
      cur = cur.next;
    }
    return wordLists;
  }

  formatDate(date: string) {
    return moment(date).format("MMMM, YYYY");
  }

  sameMonth(date1: string, date2: string) {
    return moment(date1).isSame(moment(date2), "month");
  }

  async openActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Actions",
      buttons: [
        {
          text: "Create a new list",
          icon: "add-outline",
          handler: async () => {
            const modal = await this.modalController.create({
              component: SaveListModalComponent,
              componentProps: {
                list: null,
                onSuccessCallback: this.addList,
                userId: this.userId,
              },
            });
            await modal.present();
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });

    await actionSheet.present();
  }

  addList(list: WordList) {
    if (this.listsHead) {
      let next = this.listsHead.next;
      // Check if the list is in the same month as the first list in the node
      if (next && next.date.isSame(list.createdAt, "month")) {
        next.lists.unshift(list);
      } else {
        // Create a new node
        const cur = new WordListGroupNode(list);
        cur.next = this.listsHead.next;
        this.listsHead.next = cur;
      }
    }
  }
}
