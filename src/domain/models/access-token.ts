export class AccessToken {
  constructor (readonly value: string) {}

  static readonly expirationInMs = 30 * 60 * 1000
}
