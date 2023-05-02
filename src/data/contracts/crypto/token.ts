export interface TokeGenerator {
  generateToken: (params: TokeGenerator.Params) => Promise<TokeGenerator.Result>
}

export namespace TokeGenerator {
  export type Params = {
    key: string
    expirationInMs: number
  }

  export type Result = string
}
