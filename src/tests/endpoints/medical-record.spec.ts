// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { setupApplicationWithToken } from '../init/setup.spec'
import { MedicalRecordRepository } from '../../repositories'
import { Medic, MedicalRecord } from '../../models'
import { Patient } from '../../models'
import { message } from '../../utils'
import { User } from '../../models'
import { Application } from '../..'
import { createMedRec } from '../init/init.medrec.spec'
import { delMedRec } from '../init/init.medrec.spec'

let app: Application
let client: Client
let token: string
let session: User
let testModel: MedicalRecord
let patientModel: Patient
let medicModel: Medic

const clearUpdated = async () => {
  const repo = await app.getRepository(MedicalRecordRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}

const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(MedicalRecordRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('MedicalRecord'), () => {
  it('POST    =>  /api/medicalrecord', async () => {
    await createMedRec(client, token).then(res => {
      patientModel = new Patient(res.patient)
      medicModel = new Medic(res.medic)
      testModel = new MedicalRecord(res.medRec)

      expect(res.medRec).to.have.property('createdAt').to.be.not.null()
      expect(res.medRec).to.have.property('createdBy').to.be.eql(session.id)
      // element created
      testModel = res.medRec
    })
  })

  it('GET     =>  /api/patient/{id}/medicalrecords', async () => {
    await client
      .get(`/api/patient/${patientModel.id}/medicalrecords`)
      .auth(token, { type: 'bearer' })
      .expect(200)
  })

  it('GET     =>  /api/medicalrecords/count', async () => {
    await client
      .get('/api/medicalrecords/count')
      .query({})
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/medicalrecords', async () => {
    await client
      .get('/api/medicalrecords')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/medicalrecords', async () => {
    await client
      .patch('/api/medicalrecords')
      .auth(token, { type: 'bearer' })
      .query({ where: { id: testModel.id } })
      .send({ currentIllness: `patch.${testModel.currentIllness}.edited` })
      .expect(200)
      .then(async res => {
        expect(res.body).to.have.property('count').to.be.Number().to.be.eql(1)
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('GET     =>  /api/medicalrecord/{id}', async () => {
    await client
      .get(`/api/medicalrecord/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })

  it('PATCH   =>  /api/medicalrecord/{id}', async () => {
    await client
      .patch(`/api/medicalrecord/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ currentIllness: `patch.${testModel.currentIllness}` })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
      .catch(err => console.log(err))
  })

  it('DELETE  =>  /api/medicalrecord/{id}', async () => {
    await delMedRec(client, token, medicModel, testModel)
  })
})

describe(message.noAccess('MedicalRecord'), () => {
  it('POST    =>  /api/patient/{id}/medicalrecord', async () => {
    await client.post('/api/patient/1/medicalrecord').expect(401)
  })

  it('GET     =>  /api/patient/{id}/medicalrecords', async () => {
    await client.get('/api/patient/1/medicalrecords').expect(401)
  })

  it('GET     =>  /api/medicalrecords/count', async () => {
    await client.get('/api/medicalrecords/count').expect(401)
  })

  it('GET     =>  /api/medicalrecords', async () => {
    await client.get('/api/medicalrecords').expect(401)
  })

  it('PATCH   =>  /api/medicalrecords', async () => {
    await client.patch('/api/medicalrecords').expect(401)
  })

  it('GET     =>  /api/medicalrecord/{id}', async () => {
    await client.get('/api/medicalrecord/1').expect(401)
  })

  it('PATCH   =>  /api/medicalrecord/{id}', async () => {
    await client.patch('/api/medicalrecord/1').expect(401)
  })

  it('DELETE  =>  /api/medicalrecord/{id}', async () => {
    await client.delete('/api/medicalrecord/1').expect(401)
  })
})
