// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { ExamRepository, MedicalExamRepository } from '../../repositories'
import { setupApplicationWithToken } from '../init/setup.spec'
import { createMedRec } from '../init/init.medrec.spec'
import { ExamTypeRepository } from '../../repositories'
import { delMedRec } from '../init/init.medrec.spec'
import { Client, expect } from '@loopback/testlab'
import { MedicalRecord } from '../../models'
import { ExamType } from '../../models'
import { Patient } from '../../models'
import { message } from '../../utils'
import { Medic } from '../../models'
import { Application } from '../..'
import { Exam } from '../../models'

let app: Application
let client: Client
let token: string
let examTypeModel: ExamType
let examModel: Exam
let patientModel: Patient
let medicModel: Medic
let medRecModel: MedicalRecord

before('setupApplication', async () => {
  ;({ app, client, token } = await setupApplicationWithToken())
})

after(async () => {
  const diagRepo = await app.getRepository(MedicalExamRepository)
  await diagRepo.deleteAll({
    and: [{ examId: examModel.id }, { medicalRecordId: medRecModel.id }]
  })

  await delMedRec(client, token, medicModel, medRecModel)

  const dRepo = await app.getRepository(ExamRepository)
  await dRepo.deleteById(examModel.id)

  const etRepo = await app.getRepository(ExamTypeRepository)
  await etRepo.deleteById(examTypeModel.id)

  await app.stop()
})

describe(message.withAccess('MedicalExam'), () => {
  it('POST    =>  /api/medicalrecord/{id}/medicalexams', async () => {
    // create an exam
    await client
      .post('/api/examtype')
      .send({
        name: `test.name${Date.now()}`
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(({ body }) => (examTypeModel = new ExamType(body)))

    await client
      .post(`/api/examtype/${examTypeModel.id}/exam`)
      .auth(token, { type: 'bearer' })
      .send({ name: `test.exam${Date.now()}`, examTypeId: examTypeModel.id })
      .expect(200)
      .then(({ body }) => (examModel = new Exam(body)))

    // Create a patient and their medical record
    await createMedRec(client, token).then(res => {
      patientModel = new Patient(res.patient)
      medicModel = new Medic(res.medic)
      medRecModel = new MedicalRecord(res.medRec)
    })

    await client
      .post(`/api/medicalrecord/${medRecModel.id}/medicalexams`)
      .send([{ examId: examModel.id }])
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(({ body }) => {
        expect(body).to.have.property('count').to.be.Number().to.be.eql(1)
      })
  })

  it('GET     =>  /api/medicalrecord/{id}/medicalexams', async () => {
    await client
      .get(`/api/medicalrecord/${patientModel.id}/medicalexams`)
      .auth(token, { type: 'bearer' })
      .expect(200)
  })
})

describe(message.noAccess('MedicalExam'), () => {
  it('POST    =>  /api/medicalrecord/{id}/medicalexams', async () => {
    await client.post('/api/medicalrecord/1/medicalexams').expect(401)
  })

  it('GET     =>  /api/medicalrecord/{id}/medicalexams', async () => {
    await client.get('/api/medicalrecord/1/medicalexams').expect(401)
  })
})
