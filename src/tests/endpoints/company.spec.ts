// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { message, app as pkg } from '../../utils'

let app: Application
let client: Client
let token: string

before('setupApplication', async () => {
  ;({ app, client, token } = await setupApplicationWithToken())
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('Company'), () => {
  it('GET     =>  /api/company', async () => {
    await client
      .get('/api/company')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('name')
      })
  })

  it('PATCH   =>  /api/company', async () => {
    await client
      .patch('/api/company')
      .auth(token, { type: 'bearer' })
      .send({ smallName: `${pkg.name} hospital` })
      .expect(204)
  })
})

describe(message.noAccess('Company'), () => {
  it('GET     =>  /api/company', async () => {
    await client.get('/api/company').expect(401)
  })
  it('PATCH   =>  /api/company', async () => {
    await client.patch('/api/company').expect(401)
  })
})
