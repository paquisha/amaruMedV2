// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { ExamTypeRepository } from '../../repositories'
import { ExamRepository } from '../../repositories'
import { ExamType } from '../../models'
import { Exam } from '../../models'
import { User } from '../../models'
import { message } from '../../utils'

let app: Application
let client: Client
let token: string
let session: User
let testModel: Exam
let dtTestModel: ExamType

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

const clearUpdated = async () => {
  const repo = await app.getRepository(ExamRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}
const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(ExamRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

after(async () => {
  await app.stop()
})

describe(message.withAccess('Exams'), () => {
  it('POST    =>  ​/api/examtype/{id}/exam', async () => {
    await client
      .post('/api/examtype')
      .send({
        name: `test.name${Date.now()}`
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(({ body }) => (dtTestModel = body))

    await client
      .post(`/api/examtype/${dtTestModel.id}/exam`)
      .auth(token, { type: 'bearer' })
      .send({ name: `test.exam${Date.now()}`, examTypeId: dtTestModel.id })
      .expect(200)
      .then(({ body }) => (testModel = body))
  })

  it('GET     =>  ​/api/examtype/{id}/exams', async () => {
    await client
      .get(`/api/examtype/${dtTestModel.id}/exams`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.Array()
      })
  })

  it('GET     =>  /api/exams/count', async () => {
    await client
      .get('/api/exams/count')
      .query({})
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/exams', async () => {
    await client
      .get('/api/exams')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/exams', async () => {
    await client
      .patch('/api/exams')
      .auth(token, { type: 'bearer' })
      .query({ where: { id: testModel.id } })
      .send({ name: `test.dis.patch${Date.now()}` })
      .expect(200)
      .then(async ({ body }) => {
        expect(body).to.have.property('count').to.be.Number().to.be.eql(1)
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('GET     =>  /api/exam/{id}', async () => {
    await client
      .get(`/api/exam/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })

  it('PATCH   =>  /api/exam/{id}', async () => {
    await client
      .patch(`/api/exam/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ name: `test.patch:id.${Date.now()}` })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('DELETE  =>  /api/exam/{id}', async () => {
    await client
      .delete(`/api/exam/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
      .then(async () => {
        const repo = await app.getRepository(ExamTypeRepository)
        await repo.deleteById(dtTestModel.id)
      })
  })
})

describe(message.noAccess('Exams'), () => {
  it('GET     =>  ​/api/examtype/1/exams', async () => {
    await client.get('/api/examtype/1/exams').expect(401)
  })

  it('POST    =>  ​/api/examtype/1/exam', async () => {
    await client.post('/api/examtype/1/exam').expect(401)
  })

  it('GET     =>  /api/exams/count', async () => {
    await client.get('/api/exams/count').expect(401)
  })

  it('GET     =>  /api/exams', async () => {
    await client.get('/api/exams').expect(401)
  })

  it('PATCH   =>  /api/exams', async () => {
    await client.patch('/api/exams').expect(401)
  })

  it('GET     =>  /api/exam/{id}', async () => {
    await client.get(`/api/exam/1`).expect(401)
  })

  it('PATCH   =>  /api/exam/{id}', async () => {
    await client.patch(`/api/exam/1`).expect(401)
  })

  it('DELETE  =>  /api/exam/{id}', async () => {
    await client.delete(`/api/exam/1`).expect(401)
  })
})
