// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DEFAULT_ADMIN_ROLE } from '../../migrations'
import { Client } from '@loopback/testlab'
import { random } from '../../utils'
import { Medic } from '../../models'

/**
 * Create a new medic instance
 * @param client
 * @param token
 */
export async function createMedic(client: Client, token: string): Promise<Medic> {
  // load role admin
  const role = (
    await client
      .get('/api/roles')
      .auth(token, { type: 'bearer' })
      .query({ filter: { where: { name: DEFAULT_ADMIN_ROLE.name } } })
      .expect(200)
  ).body[0]

  // create a profile instance
  const profile = (
    await client
      .post('/api/profile')
      .send({
        lastName: random.string(5, true),
        firstName: random.string(5, true),
        address: random.string(5, true),
        email: random.email()
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
  ).body

  // create a user instance
  const user = (
    await client
      .post(`/api/profile/${profile.id}/user`)
      .send({
        email: profile.email,
        roleId: role.id,
        profileId: profile.id
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
  ).body

  // create a medic
  const medic = (
    await client
      .post(`/api/user/${user.id}/medic`)
      .send({
        regProfessional: random.string(5)
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
  ).body

  return medic
}

/**
 * Delete a medic instance
 * @param client
 * @param token
 * @param medic
 */
export async function delMedic(client: Client, token: string, medic: Medic) {
  await client
    .delete(`/api/medic/${medic.id}`)
    .auth(token, { type: 'bearer' })
    .expect(204)
  await client
    .delete(`/api/account/user/${medic.userId}`)
    .auth(token, { type: 'bearer' })
    .expect(204)
}
