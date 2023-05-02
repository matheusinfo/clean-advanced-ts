export class AccessToken {
  constructor (private readonly value: string) {}

  static readonly expirationInMs = 30 * 60 * 1000
}
