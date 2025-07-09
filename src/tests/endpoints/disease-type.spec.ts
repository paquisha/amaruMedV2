// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { DiseaseTypeRepository } from '../../repositories'
import { message } from '../../utils'
import { DiseaseType } from '../../models'
import { User } from '../../models'

let app: Application
let client: Client
let token: string
let session: User
let testModel: DiseaseType

const clearUpdated = async () => {
  const repo = await app.getRepository(DiseaseTypeRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}

const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(DiseaseTypeRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('DiseaseType'), () => {
  it('POST    =>  /api/diseasetype', async () => {
    await client
      .post('/api/diseasetype')
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

  it('GET     =>  /api/diseasetypes/count', async () => {
    await client
      .get('/api/diseasetypes/count')
      .query({})
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/diseasetypes', async () => {
    await client
      .get('/api/diseasetypes')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/diseasetypes', async () => {
    await client
      .patch('/api/diseasetypes')
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

  it('GET     =>  /api/diseasetype/{id}', async () => {
    await client
      .get(`/api/diseasetype/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })
  it('PATCH   =>  /api/diseasetype/{id}', async () => {
    await client
      .patch(`/api/diseasetype/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ name: `test.patch.2_${Date.now()}` })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('DELETE  =>  /api/diseasetype/{id}', async () => {
    await client
      .delete(`/api/diseasetype/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
  })
})

describe(message.noAccess('DiseaseType'), () => {
  it('POST    =>  /api/diseasetype', async () => {
    await client.post('/api/diseasetype').expect(401)
  })

  it('GET     =>  /api/diseasetypes/count', async () => {
    await client.get('/api/diseasetypes').expect(401)
  })

  it('GET     =>  /api/disease/{id}/diseasetype', async () => {
    await client.get('/api/disease/1/diseasetype').expect(401)
  })

  it('GET     =>  /api/diseasetypes', async () => {
    await client.get('/api/diseasetypes').expect(401)
  })

  it('PATCH   =>  /api/diseasetypes', async () => {
    await client.patch('/api/diseasetypes').expect(401)
  })

  it('GET     =>  /api/diseasetype/{id}', async () => {
    await client.get('/api/diseasetype/1').expect(401)
  })

  it('PATCH   =>  /api/diseasetype/{id}', async () => {
    await client.patch('/api/diseasetype/1').expect(401)
  })

  it('DELETE  =>  /api/diseasetype/{id}', async () => {
    await client.delete('/api/diseasetype/1').expect(401)
  })
})
