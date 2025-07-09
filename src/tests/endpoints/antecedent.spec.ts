// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { setupApplicationWithToken } from '../init/setup.spec'
import { AntecedentRepository } from '../../repositories'
import { Antecedent } from '../../models'
import { Patient } from '../../models'
import { message } from '../../utils'
import { User } from '../../models'
import { Application } from '../..'
import { random } from '../../utils'

let app: Application
let client: Client
let token: string
let session: User
let testModel: Antecedent
let patientModel: Patient

const clearUpdated = async () => {
  const repo = await app.getRepository(AntecedentRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}

const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(AntecedentRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('Antecedent'), () => {
  it('POST    =>  /api/pacient/{id}/antecedent', async () => {
    await client
      .post('/api/patient')
      .send({
        hc: random.string(5),
        lastName: 'ln_test',
        firstName: 'fn_test',
        ocupation: 'ocupation',
        birthday: new Date(),
        address: 'address_test',
        sex: 0,
        civilStatus: 0
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(({ body }) => (patientModel = new Patient(body)))

    await client
      .post(`/api/patient/${patientModel.id}/antecedent`)
      .send({ surgical: 'surgical_test', family: 'family_test' })
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(({ body }) => {
        expect(body).to.have.property('createdAt').to.be.not.null()
        expect(body).to.have.property('createdBy').to.be.eql(session.id)
        // element created
        testModel = new Antecedent(body)
      })
  })

  it('GET     =>  /api/patient/{id}/antecedent', async () => {
    await client
      .get(`/api/patient/${patientModel.id}/antecedent`)
      .auth(token, { type: 'bearer' })
      .expect(200)
  })

  it('GET     =>  /api/antecedents/count', async () => {
    await client
      .get('/api/antecedents/count')
      .query({})
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/antecedents', async () => {
    await client
      .get('/api/antecedents')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/antecedents', async () => {
    await client
      .patch('/api/antecedents')
      .auth(token, { type: 'bearer' })
      .query({ where: { id: testModel.id } })
      .send({ family: `patch.${testModel.family}.edited` })
      .expect(200)
      .then(async res => {
        expect(res.body).to.have.property('count').to.be.Number().to.be.eql(1)
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('GET     =>  /api/antecedent/{id}', async () => {
    await client
      .get(`/api/antecedent/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })

  it('PATCH   =>  /api/antecedent/{id}', async () => {
    await client
      .patch(`/api/antecedent/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ surgical: `patch.${testModel.surgical}` })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('DELETE  =>  /api/antecedent/{id}', async () => {
    await client
      .delete(`/api/antecedent/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
      .then(async () => {
        await client
          .delete(`/api/patient/${patientModel.id}`)
          .auth(token, { type: 'bearer' })
          .expect(204)
      })
  })
})

describe(message.noAccess('Antecedent'), () => {
  it('POST    =>  /api/patient/{id}/antecedent', async () => {
    await client.post('/api/patient/1/antecedent').expect(401)
  })

  it('GET     =>  /api/patient/{id}/antecedent', async () => {
    await client.get('/api/patient/1/antecedent').expect(401)
  })

  it('GET     =>  /api/antecedents/count', async () => {
    await client.get('/api/antecedents/count').expect(401)
  })

  it('GET     =>  /api/antecedents', async () => {
    await client.get('/api/antecedents').expect(401)
  })

  it('PATCH   =>  /api/antecedents', async () => {
    await client.patch('/api/antecedents').expect(401)
  })

  it('GET     =>  /api/antecedent/{id}', async () => {
    await client.get('/api/antecedent/1').expect(401)
  })

  it('PATCH   =>  /api/antecedent/{id}', async () => {
    await client.patch('/api/antecedent/1').expect(401)
  })

  it('DELETE  =>  /api/antecedent/{id}', async () => {
    await client.delete('/api/antecedent/1').expect(401)
  })
})
