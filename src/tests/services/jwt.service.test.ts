// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { JWTService, MyJWTService } from '../../services'
import { decode } from 'jsonwebtoken'
import { expect } from '@loopback/testlab'
import { message } from '../../utils'
import { random } from '../../utils'
import { TOKEN } from '../../configs'

const EMAIL = random.email()

describe(message.service('JWTService'), () => {
  const jwt: JWTService = new MyJWTService(TOKEN.secret)
  let token: string

  it('Generate an unlimited token', async () => {
    token = await jwt.generateToken(EMAIL)
    expect(token).to.be.not.null()
    expect(decode(token)).to.have.not.property('exp')
  })
  it('Generate a limited token', async () => {
    token = await jwt.generateToken(EMAIL, 500)
    expect(token).to.be.not.null()
    expect(decode(token)).to.have.property('exp').to.be.Number()
  })

  it('Validate a token', async () => {
    const verified = await jwt.verifyToken(token)
    expect(verified).to.have.property('email')
  })
})
