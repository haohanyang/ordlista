import { Platform } from '@angular/cdk/platform'
import { Component, Inject } from '@angular/core'
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet'

export interface InstallPwaPromptData {
  promptEvent: any
}

@Component({
  selector: 'app-install-pwa-prompt',
  templateUrl: './install-pwa-prompt.component.html',
})
export class InstallPwaPromptComponent {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: InstallPwaPromptData,
    private bottomSheet: MatBottomSheetRef<InstallPwaPromptComponent>, public platform: Platform) {
  }

  installPwa() {
    this.data.promptEvent.prompt()
    this.bottomSheet.dismiss()
  }

  close() {
    this.bottomSheet.dismiss()
  }
}
