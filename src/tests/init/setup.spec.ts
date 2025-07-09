// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Application } from '../..'
import { createRestAppClient } from '@loopback/testlab'
import { givenHttpServerConfig } from '@loopback/testlab'
import { Client } from '@loopback/testlab'
import { DEFAULT_ADMIN } from '../../migrations'
import { User } from '../../models'

/**
 * Setup the application with the client.
 */
export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({})

  const app = new Application({
    rest: restConfig
  })

  await app.boot()
  await app.start()

  const client = createRestAppClient(app)

  return { app, client }
}

/**
 * Setup the application with the client and access token.
 */
export async function setupApplicationWithToken(): Promise<AppWithClientLogged> {
  const setup = await setupApplication()
  const app: Application = setup.app
  const client: Client = setup.client

  // get access token
  const resToken = await client.post('/api/account/login').send({
    email: DEFAULT_ADMIN.email,
    password: DEFAULT_ADMIN.password
  })
  const token = resToken.body.token

  // get account profile
  const resProfile = await client.get('/api/account/me').auth(token, { type: 'bearer' })
  const session: User = resProfile.body.user

  return { app, client, token, session }
}

export interface AppWithClient {
  app: Application
  client: Client
}
export interface AppWithClientLogged extends AppWithClient {
  token: string
  session: User
}
