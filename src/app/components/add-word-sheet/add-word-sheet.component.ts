import { Component, Inject } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { SaveWordModalComponent, SaveWordModalData } from "../save-word-modal/save-word-modal.component"
import { Word } from "src/app/models/word"
import { MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet"
import { SearchWordModalComponent, SearchWordModalData } from "../search-word-modal/search-word-modal.component"

export interface AddWordSheetData {
  listId: string
  userId: string
  addWordCallback: (word: Word) => void
  closeBottomSheet: () => void
}

@Component({
  selector: "app-add-word-sheet",
  templateUrl: "./add-word-sheet.component.html",
})
export class AddWordSheetComponent {

  constructor(private dialog: MatDialog, @Inject(MAT_BOTTOM_SHEET_DATA) public data: AddWordSheetData) {
  }

  openAddWordModal() {
    this.dialog.open<SaveWordModalComponent, SaveWordModalData>(SaveWordModalComponent, {
      width: "400px",
      data: {
        word: null,
        listId: this.data.listId,
        userId: this.data.userId,
        submitCallback: this.data.addWordCallback
      }
    })
    this.data.closeBottomSheet()
  }

  openSearchWordModal() {
    this.dialog.open<SearchWordModalComponent, SearchWordModalData>(SearchWordModalComponent, {
      width: "400px",
      data: {
        listId: this.data.listId,
        userId: this.data.userId,
        addWordCallback: this.data.addWordCallback
      }
    })
    this.data.closeBottomSheet()
  }
}
