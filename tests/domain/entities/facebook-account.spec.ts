import { FacebookAccount } from '@/domain/entities'

describe('FacebookAccount', () => {
  const facebookData = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  }

  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(facebookData)

    expect(sut).toEqual(facebookData)
  })

  it('should update name if its empty', () => {
    const accountData = {
      id: 'any_id'
    }

    const sut = new FacebookAccount(facebookData, accountData)

    expect(sut).toEqual({
      id: accountData.id,
      name: facebookData.name,
      email: facebookData.email,
      facebookId: facebookData.facebookId
    })
  })

  it('should not update name if its not empty', () => {
    const accountData = {
      id: 'any_id',
      name: 'any_name'
    }

    const sut = new FacebookAccount(facebookData, accountData)

    expect(sut).toEqual({
      id: accountData.id,
      name: accountData.name,
      email: facebookData.email,
      facebookId: facebookData.facebookId
    })
  })
})
