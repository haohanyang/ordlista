interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  /**
   * Built-in environment variable.
   * @see Docs https://github.com/chihab/ngx-env#ng_app_env.
   */
  readonly NG_APP_COGNITO_USER_POOL_CLIENT_ID: string
  readonly NG_APP_COGNITO_USER_POOL_ID: string
  readonly NG_APP_API_BASE_URL: string
  readonly NG_APP_COMMIT_HASH: string
  readonly NG_APP_COMMIT_BRANCH: string
  [key: string]: any
}