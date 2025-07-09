// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { ProfileRepository } from '../../repositories'
import { message, random } from '../../utils'
import { Profile } from '../../models'
import { User } from '../../models'

let app: Application
let client: Client
let token: string
let session: User
let testModel: Profile

const clearUpdated = async () => {
  const repo = await app.getRepository(ProfileRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}

const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(ProfileRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

after(async () => {
  const repo = await app.getRepository(ProfileRepository)
  await repo.deleteById(testModel.id)
  await app.stop()
})

describe(message.withAccess('Profile'), () => {
  it('POST    =>  /api/profile', async () => {
    await client
      .post('/api/profile')
      .send({
        lastName: `test.ln${Date.now()}`,
        firstName: `test.fn${Date.now()}`,
        address: `test.address${Date.now()}`,
        email: random.email()
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
        expect(res.body).to.have.property('createdBy').to.be.equal(session.id)
        // element created
        testModel = res.body
      })
  })

  it('GET     =>  /api/profiles/count', async () => {
    await client
      .get('/api/profiles/count')
      .query({})
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/profiles', async () => {
    await client
      .get('/api/profiles')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/profiles', async () => {
    await client
      .patch('/api/profiles')
      .auth(token, { type: 'bearer' })
      .query({ where: { id: testModel.id } })
      .send({ lastName: `ln_patch_${Date.now()}` })
      .expect(200)
      .then(async res => {
        expect(res.body).to.have.property('count').to.be.Number()
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('GET     =>  /api/profile/{id}', async () => {
    await client
      .get(`/api/profile/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })

  it('PATCH   =>  /api/profile/{id}', async () => {
    await client
      .patch(`/api/profile/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ firstName: `fn_patch_${Date.now()}` })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })
})

describe(message.noAccess('Profile'), () => {
  it('POST    =>  /api/profile', async () => {
    await client.post('/api/profile').expect(401)
  })

  it('GET     =>  /api/profiles/count', async () => {
    await client.get('/api/profiles').expect(401)
  })

  it('GET     =>  /api/profiles', async () => {
    await client.get('/api/profiles').expect(401)
  })

  it('PATCH   =>  /api/profiles', async () => {
    await client.patch('/api/profiles').expect(401)
  })

  it('GET     =>  /api/profile/{id}', async () => {
    await client.get('/api/profile/1').expect(401)
  })

  it('PATCH   =>  /api/profile/{id}', async () => {
    await client.patch('/api/profile/1').expect(401)
  })
})
