// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplication } from '../init/setup.spec'
import { message } from '../../utils'

describe(message.endpoint('Ping'), () => {
  let app: Application
  let client: Client

  before('setupApplication', async () => {
    ;({ app, client } = await setupApplication())
  })

  after(async () => {
    await app.stop()
  })

  it('GET     =>  /api/ping', async () => {
    const res = await client.get('/ping').expect(200)
    expect(res.body).to.containEql({ success: true })
  })
})
