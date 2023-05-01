export interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<LoadFacebookUserApi.Result>
}

export namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }

  type LoadFacebookResult = {
    name: string
    email: string
    facebookId: string
  }

  export type Result = LoadFacebookResult | undefined
}
