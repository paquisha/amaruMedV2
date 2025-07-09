// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplication } from '../init/setup.spec'
import { message } from '../../utils'

describe(message.endpoint('App'), () => {
  let app: Application
  let client: Client

  before('setupApplication', async () => {
    ;({ app, client } = await setupApplication())
  })

  after(async () => {
    await app.stop()
  })

  it('GET     =>  /api/app', async () => {
    await client
      .get('/api/app')
      .expect(200)
      .then(res => {
        expect(res.body).to.have.properties('name', 'version', 'company')
      })
  })
})
