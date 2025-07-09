// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { BcryptHasher } from '../../services'
import { expect } from '@loopback/testlab'
import { message } from '../../utils'

const DECRYPTED = 'my message'

describe(message.service('Bcrypt'), () => {
  it('Encrypt and compare', async () => {
    const bcrypt: BcryptHasher = new BcryptHasher(Math.random())
    const encrypted = await bcrypt.encrypt(DECRYPTED)
    const compared = await bcrypt.compare(DECRYPTED, encrypted)
    expect(compared).true()
  })
})
