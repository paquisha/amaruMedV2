// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { setupApplicationWithToken } from '../init/setup.spec'
import { Client, expect } from '@loopback/testlab'
import { message } from '../../utils'
import { Application } from '../..'
import { User } from '../../models'

let app: Application
let client: Client
let token: string
let session: User

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('Log'), () => {
  it('GET     =>  /api/logs', async () => {
    await client
      .get('/api/logs')
      .auth(token, { type: 'bearer' })
      .query({
        audit: { createdBy: session.id, editedBy: session.id, deletedBy: session.id }
      })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.properties('createdBy', 'editedBy', 'deletedBy')
      })
  })
})

describe(message.noAccess('Log'), () => {
  it('GET     =>  /api/logs', async () => {
    await client.get('/api/logs').expect(401)
  })
})
