export interface TokeGenerator {
  generateToken: (params: TokeGenerator.Params) => Promise<TokeGenerator.Result>
}

export namespace TokeGenerator {
  export type Params = {
    key: string
  }

  export type Result = void
}
