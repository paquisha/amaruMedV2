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

describe(message.withAccess('Group'), () => {
  it('GET     =>  /api/groups', async () => {
    await client
      .get('/api/groups')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('GET     =>  ​/api/option/{id}/group', async () => {
    await client
      .get('/api/option/1/group')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('id')
        expect(res.body).to.have.property('name')
      })
  })
})

describe(message.noAccess('Group'), () => {
  it('GET     =>  /api/groups', async () => {
    await client.get('/api/groups').expect(401)
  })

  it('GET     =>  ​/api/option/{id}/group', async () => {
    await client.get('/api/option/1/group').expect(401)
  })
})
