// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { PatientRepository } from '../../repositories'
import { message } from '../../utils'
import { Patient } from '../../models'
import { User } from '../../models'
import { random } from '../../utils'

let app: Application
let client: Client
let token: string
let session: User
let testModel: Patient

const clearUpdated = async () => {
  const repo = await app.getRepository(PatientRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}

const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(PatientRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('Patient'), () => {
  it('POST    =>  /api/patient', async () => {
    await client
      .post('/api/patient')
      .send({
        hc: random.string(5),
        lastName: 'ln_test',
        firstName: 'fn_test',
        ocupation: 'ocupation',
        birthday: new Date('2019-02-20'),
        address: 'address_test',
        sex: 0,
        civilStatus: 0
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

  it('GET     =>  /api/patients/count', async () => {
    await client
      .get('/api/patients/count')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/patients', async () => {
    await client
      .get('/api/patients')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/patients', async () => {
    await client
      .patch('/api/patients')
      .auth(token, { type: 'bearer' })
      .query({ where: { id: testModel.id } })
      .send({ firstName: `fn_patch_${Date.now()}` })
      .expect(200)
      .then(async res => {
        expect(res.body).to.have.property('count').to.be.Number()
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('GET     =>  /api/patient/{id}', async () => {
    await client
      .get(`/api/patient/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })

  it('PATCH   =>  /api/patient/{id}', async () => {
    await client
      .patch(`/api/patient/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ lastName: `ln_patch_${Date.now()}` })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('DELETE  =>  /api/patient/{id}', async () => {
    await client
      .delete(`/api/patient/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
  })
})

describe(message.noAccess('Patient'), () => {
  it('POST    =>  /api/patient', async () => {
    await client.post('/api/patient').expect(401)
  })

  it('GET     =>  /api/patients/count', async () => {
    await client.get('/api/patients').expect(401)
  })

  it('GET     =>  /api/patients', async () => {
    await client.get('/api/patients').expect(401)
  })

  it('PATCH   =>  /api/patients', async () => {
    await client.patch('/api/patients').expect(401)
  })

  it('GET     =>  /api/patient/{id}', async () => {
    await client.get('/api/patient/1').expect(401)
  })

  it('PATCH   =>  /api/patient/{id}', async () => {
    await client.patch('/api/patient/1').expect(401)
  })

  it('DELETE  =>  /api/patient/{id}', async () => {
    await client.delete('/api/patient/1').expect(401)
  })
})
