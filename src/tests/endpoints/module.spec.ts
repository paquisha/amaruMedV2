// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { message } from '../../utils'

let app: Application
let client: Client
let token: string

before('setupApplication', async () => {
  ;({ app, client, token } = await setupApplicationWithToken())
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('Module'), () => {
  it('GET     =>  /api/modules', async () => {
    await client
      .get('/api/modules')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('GET     =>  ​/api​/role​/{id}​/modules', async () => {
    await client
      .get('/api/role/1/modules')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })
})

describe(message.noAccess('Module'), () => {
  it('GET     =>  /api/modules', async () => {
    await client.get('/api/modules').expect(401)
  })

  it('GET     =>  /api​/role​/{id}​/modules', async () => {
    await client.get('/api/role/1/modules').expect(401)
  })
})
