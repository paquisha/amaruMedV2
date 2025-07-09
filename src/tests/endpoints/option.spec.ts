// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { OptionRepository } from '../../repositories'
import { message } from '../../utils'
import { Option } from '../../models'
import { User } from '../../models'
import { BLOODTYPE } from '../../migrations'

let app: Application
let client: Client
let token: string
let session: User
let testModel: Option

const clearUpdated = async () => {
  const repo = await app.getRepository(OptionRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}

const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(OptionRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('Option'), () => {
  it('POST    =>  /api/option', async () => {
    await client
      .post('/api/option')
      .send({
        name: `option.${Date.now()}`,
        groupId: BLOODTYPE.id
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

  it('GET     =>  /api/options/count', async () => {
    await client
      .get('/api/options/count')
      .query({})
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/options', async () => {
    await client
      .get('/api/options')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/options', async () => {
    await client
      .patch('/api/options')
      .auth(token, { type: 'bearer' })
      .query({ where: { id: testModel.id } })
      .send({ name: `patch_${Date.now()}` })
      .expect(200)
      .then(async res => {
        expect(res.body).to.have.property('count').to.be.Number()
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('GET     =>  /api/option/{id}', async () => {
    await client
      .get(`/api/option/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })

  it('PATCH   =>  /api/option/{id}', async () => {
    await client
      .patch(`/api/option/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ name: `patch_${Date.now()}` })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('DELETE  =>  /api/option/{id}', async () => {
    await client
      .delete(`/api/option/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
      .then(async () => {
        const repo = await app.getRepository(OptionRepository)
        const result = await repo.findById(testModel.id)
        expect(result.deleted).to.be.eql(true)
        expect(result.deletedBy).to.be.eql(session.id)
        expect(result.deletedAt).to.be.not.null()
        await repo.deleteById(testModel.id)
      })
  })
})

describe(message.noAccess('Option'), () => {
  it('POST    =>  /api/option', async () => {
    await client.post('/api/option').expect(401)
  })

  it('GET     =>  /api/options/count', async () => {
    await client.get('/api/options').expect(401)
  })

  it('GET     =>  /api/options', async () => {
    await client.get('/api/options').expect(401)
  })

  it('PATCH   =>  /api/options', async () => {
    await client.patch('/api/options').expect(401)
  })

  it('GET     =>  /api/option/{id}', async () => {
    await client.get('/api/option/1').expect(401)
  })

  it('PATCH   =>  /api/option/{id}', async () => {
    await client.patch('/api/option/1').expect(401)
  })

  it('DELETE  =>  /api/option/{id}', async () => {
    await client.delete('/api/option/1').expect(401)
  })
})
