import { Component } from '@angular/core'
import packageJson from '../../../../package.json'
@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html'
})
export class InfoModalComponent {
  appVersion = packageJson.version
  commitHash = import.meta.env.NG_APP_COMMIT_HASH
  commitHashShort = import.meta.env.NG_APP_COMMIT_HASH_SHORT
  commitBranch = import.meta.env.NG_APP_COMMIT_BRANCH

  get commitUrl() {
    return `https://github.com/haohanyang/ordlista/commit/${this.commitHash}`
  }

  get branchUrl() {
    return `https://github.com/haohanyang/ordlista/tree/${this.commitBranch}`
  }
}
