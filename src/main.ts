import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'
import { I18n } from 'aws-amplify'
import * as dict from './i18n.json'

I18n.putVocabulariesForLanguage('sv', dict)
I18n.setLanguage('sv')
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err))
