import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'
import { Amplify } from 'aws-amplify'

Amplify.configure({
  aws_cognito_region: "eu-north-1",
  aws_user_pools_id: import.meta.env.NG_APP_COGNITO_USER_POOL_ID,
  aws_user_pools_web_client_id: import.meta.env.NG_APP_COGNITO_USER_POOL_CLIENT_ID,
})

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err))