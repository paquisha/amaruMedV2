// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { RoleRepository } from '../../repositories'
import { message } from '../../utils'
import { Role } from '../../models'
import { User } from '../../models'

let app: Application
let client: Client
let token: string
let session: User
let testModel: Role

const clearUpdated = async () => {
  const repo = await app.getRepository(RoleRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}

const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(RoleRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('Role'), () => {
  it('POST    =>  /api/role', async () => {
    await client
      .post('/api/role')
      .send({
        name: `name-${Date.now()}`,
        description: `des-${Date.now()}`
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

  it('GET     =>  /api/roles/count', async () => {
    await client
      .get('/api/roles/count')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/user/{id}/role', async () => {
    await client
      .get(`/api/user/${session.id}/role`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
        expect(res.body).to.have.property('createdBy').to.be.Number()
      })
  })

  it('GET     =>  /api/roles', async () => {
    await client
      .get('/api/roles')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/roles', async () => {
    await client
      .patch('/api/roles')
      .auth(token, { type: 'bearer' })
      .query({ where: { id: testModel.id } })
      .send({ name: `name_patch_${Date.now()}` })
      .expect(200)
      .then(async res => {
        expect(res.body).to.have.property('count').to.be.Number()
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('GET     =>  /api/role/{id}', async () => {
    await client
      .get(`/api/role/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })

  it('PATCH   =>  /api/role/{id}', async () => {
    await client
      .patch(`/api/role/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ name: `name_patch_${Date.now()}` })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('DELETE  =>  /api/role/{id}', async () => {
    await client
      .delete(`/api/role/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
  })
})

describe(message.noAccess('Role'), () => {
  it('POST    =>  /api/role', async () => {
    await client.post('/api/role').expect(401)
  })

  it('GET     =>  /api/roles/count', async () => {
    await client.get('/api/roles').expect(401)
  })

  it('GET     =>  /api/user/{id}/role', async () => {
    await client.get('/api/user/1/role').expect(401)
  })

  it('GET     =>  /api/roles', async () => {
    await client.get('/api/roles').expect(401)
  })

  it('PATCH   =>  /api/roles', async () => {
    await client.patch('/api/roles').expect(401)
  })

  it('GET     =>  /api/role/{id}', async () => {
    await client.get('/api/role/1').expect(401)
  })

  it('PATCH   =>  /api/role/{id}', async () => {
    await client.patch('/api/role/1').expect(401)
  })

  it('DELETE  =>  /api/role/{id}', async () => {
    await client.delete('/api/role/1').expect(401)
  })
})
