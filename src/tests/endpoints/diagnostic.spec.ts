// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DiagnosticRepository, DiseaseRepository } from '../../repositories'
import { setupApplicationWithToken } from '../init/setup.spec'
import { DiseaseTypeRepository } from '../../repositories'
import { createMedRec } from '../init/init.medrec.spec'
import { delMedRec } from '../init/init.medrec.spec'
import { Client, expect } from '@loopback/testlab'
import { MedicalRecord } from '../../models'
import { DiseaseType } from '../../models'
import { Disease } from '../../models'
import { message } from '../../utils'
import { Medic } from '../../models'
import { Application } from '../..'

let app: Application
let client: Client
let token: string
let disTypeModel: DiseaseType
let diseaseModel: Disease
let medicModel: Medic
let medRecModel: MedicalRecord

before('setupApplication', async () => {
  ;({ app, client, token } = await setupApplicationWithToken())
})

after(async () => {
  const diagRepo = await app.getRepository(DiagnosticRepository)
  await diagRepo.deleteAll({
    and: [{ diseaseId: diseaseModel.id }, { medicalRecordId: medRecModel.id }]
  })

  await delMedRec(client, token, medicModel, medRecModel)

  const dRepo = await app.getRepository(DiseaseRepository)
  await dRepo.deleteById(diseaseModel.id)

  const dtRepo = await app.getRepository(DiseaseTypeRepository)
  await dtRepo.deleteById(disTypeModel.id)

  await app.stop()
})

describe(message.withAccess('Diagnostic'), () => {
  it('POST    =>  /api/medicalrecord/{id}/diagnostics', async () => {
    // create an disease
    await client
      .post('/api/diseasetype')
      .auth(token, { type: 'bearer' })
      .send({ name: `test.name${Date.now()}` })
      .expect(200)
      .then(({ body }) => (disTypeModel = new DiseaseType(body)))

    await client
      .post(`/api/diseasetype/${disTypeModel.id}/disease`)
      .auth(token, { type: 'bearer' })
      .send({ name: `test.disease${Date.now()}`, diseaseTypeId: disTypeModel.id })
      .expect(200)
      .then(({ body }) => (diseaseModel = new Disease(body)))

    await createMedRec(client, token).then(res => {
      medicModel = new Medic(res.medic)
      medRecModel = new MedicalRecord(res.medRec)
    })

    // create the diagnostics
    await client
      .post(`/api/medicalrecord/${medRecModel.id}/diagnostics`)
      .send([{ diseaseId: diseaseModel.id }])
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(({ body }) => {
        expect(body).to.have.property('count').to.be.Number().to.be.eql(1)
      })
  })

  it('GET     =>  /api/medicalrecord/{id}/diagnostics', async () => {
    await client
      .get(`/api/medicalrecord/${medRecModel.id}/diagnostics`)
      .auth(token, { type: 'bearer' })
      .expect(200)
  })
})

describe(message.noAccess('Diagnostic'), () => {
  it('POST    =>  /api/medicalrecord/{id}/diagnostics', async () => {
    await client.post('/api/medicalrecord/1/diagnostics').expect(401)
  })

  it('GET     =>  /api/medicalrecord/{id}/diagnostics', async () => {
    await client.get('/api/medicalrecord/1/diagnostics').expect(401)
  })
})
