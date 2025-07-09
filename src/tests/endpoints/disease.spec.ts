// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { DiseaseTypeRepository } from '../../repositories'
import { DiseaseRepository } from '../../repositories'
import { DiseaseType } from '../../models'
import { Disease } from '../../models'
import { User } from '../../models'
import { message } from '../../utils'

let app: Application
let client: Client
let token: string
let session: User
let testModel: Disease
let dtTestModel: DiseaseType

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

const clearUpdated = async () => {
  const repo = await app.getRepository(DiseaseRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}
const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(DiseaseRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

after(async () => {
  await app.stop()
})

describe(message.withAccess('Diseases'), () => {
  it('POST    =>  ​/api/diseasetype/{id}/disease', async () => {
    await client
      .post('/api/diseasetype')
      .send({
        name: `test.name${Date.now()}`
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(({ body }) => (dtTestModel = body))

    await client
      .post(`/api/diseasetype/${dtTestModel.id}/disease`)
      .auth(token, { type: 'bearer' })
      .send({ name: `test.disease${Date.now()}`, diseaseTypeId: dtTestModel.id })
      .expect(200)
      .then(({ body }) => (testModel = body))
  })

  it('GET     =>  ​/api/diseasetype/{id}/diseases', async () => {
    await client
      .get(`/api/diseasetype/${dtTestModel.id}/diseases`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.Array()
      })
  })
  ////////////////////////////////////////////

  it('GET     =>  /api/diseases/count', async () => {
    await client
      .get('/api/diseases/count')
      .query({})
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/diseases', async () => {
    await client
      .get('/api/diseases')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/diseases', async () => {
    await client
      .patch('/api/diseases')
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

  it('GET     =>  /api/disease/{id}', async () => {
    await client
      .get(`/api/disease/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })

  it('PATCH   =>  /api/disease/{id}', async () => {
    await client
      .patch(`/api/disease/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ name: `test.patch:id.${Date.now()}` })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('DELETE  =>  /api/disease/{id}', async () => {
    await client
      .delete(`/api/disease/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
      .then(async () => {
        const repo = await app.getRepository(DiseaseTypeRepository)
        await repo.deleteById(dtTestModel.id)
      })
  })
})

describe(message.noAccess('Diseases'), () => {
  it('GET     =>  ​/api/diseasetype/1/diseases', async () => {
    await client.get('/api/diseasetype/1/diseases').expect(401)
  })

  it('POST    =>  ​/api/diseasetype/1/disease', async () => {
    await client.post('/api/diseasetype/1/disease').expect(401)
  })

  it('GET     =>  /api/diseases/count', async () => {
    await client.get('/api/diseases/count').expect(401)
  })

  it('GET     =>  /api/diseases', async () => {
    await client.get('/api/diseases').expect(401)
  })

  it('PATCH   =>  /api/diseases', async () => {
    await client.patch('/api/diseases').expect(401)
  })

  it('GET     =>  /api/disease/{id}', async () => {
    await client.get(`/api/disease/1`).expect(401)
  })

  it('PATCH   =>  /api/disease/{id}', async () => {
    await client.patch(`/api/disease/1`).expect(401)
  })

  it('DELETE  =>  /api/disease/{id}', async () => {
    await client.delete(`/api/disease/1`).expect(401)
  })
})
