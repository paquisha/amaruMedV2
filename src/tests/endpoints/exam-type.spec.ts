// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { ExamTypeRepository } from '../../repositories'
import { message } from '../../utils'
import { ExamType } from '../../models'
import { User } from '../../models'

let app: Application
let client: Client
let token: string
let session: User
let testModel: ExamType

const clearUpdated = async () => {
  const repo = await app.getRepository(ExamTypeRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}

const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(ExamTypeRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('ExamType'), () => {
  it('POST    =>  /api/examtype', async () => {
    await client
      .post('/api/examtype')
      .send({
        name: `test.name${Date.now()}`
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

  it('GET     =>  /api/examtypes/count', async () => {
    await client
      .get('/api/examtypes/count')
      .query({})
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/examtypes', async () => {
    await client
      .get('/api/examtypes')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/examtypes', async () => {
    await client
      .patch('/api/examtypes')
      .auth(token, { type: 'bearer' })
      .query({ where: { id: testModel.id } })
      .send({ name: `test.name.pathc_${Date.now()}` })
      .expect(200)
      .then(async res => {
        expect(res.body).to.have.property('count').to.be.Number()
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('GET     =>  /api/examtype/{id}', async () => {
    await client
      .get(`/api/examtype/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })
  it('PATCH   =>  /api/examtype/{id}', async () => {
    await client
      .patch(`/api/examtype/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ name: `test.patch.2_${Date.now()}` })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('DELETE  =>  /api/examtype/{id}', async () => {
    await client
      .delete(`/api/examtype/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
  })
})

describe(message.noAccess('ExamType'), () => {
  it('POST    =>  /api/examtype', async () => {
    await client.post('/api/examtype').expect(401)
  })

  it('GET     =>  /api/examtypes/count', async () => {
    await client.get('/api/examtypes').expect(401)
  })

  it('GET     =>  /api/exam/{id}/examtype', async () => {
    await client.get('/api/exam/1/examtype').expect(401)
  })

  it('GET     =>  /api/examtypes', async () => {
    await client.get('/api/examtypes').expect(401)
  })

  it('PATCH   =>  /api/examtypes', async () => {
    await client.patch('/api/examtypes').expect(401)
  })

  it('GET     =>  /api/examtype/{id}', async () => {
    await client.get('/api/examtype/1').expect(401)
  })

  it('PATCH   =>  /api/examtype/{id}', async () => {
    await client.patch('/api/examtype/1').expect(401)
  })

  it('DELETE  =>  /api/examtype/{id}', async () => {
    await client.delete('/api/examtype/1').expect(401)
  })
})
