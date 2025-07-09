// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Medic, MedicalRecord, Patient } from '../../models'
import { createMedic } from './init.medic.spec'
import { delMedic } from './init.medic.spec'
import { Client } from '@loopback/testlab'
import { random } from '../../utils'

/**
 * Create a new medical record instance
 * @param client
 * @param token
 */
export async function createMedRec(
  client: Client,
  token: string
): Promise<{ medRec: MedicalRecord; medic: Medic; patient: Patient }> {
  const medic = await createMedic(client, token)

  const patient = (
    await client
      .post('/api/patient')
      .send({
        hc: random.string(5),
        lastName: random.string(5),
        firstName: random.string(5),
        ocupation: `${random.string(5)}_ocupation`,
        birthday: new Date('2019-02-20'),
        address: `${random.string(5)}_address`,
        sex: 0,
        civilStatus: 0
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
  ).body

  const medRec = (
    await client
      .post(`/api/patient/${patient.id}/medicalrecord`)
      .send({ reason: 'reason_test', medicId: medic.id, currentIllness: 'illness' })
      .auth(token, { type: 'bearer' })
      .expect(200)
  ).body

  return { medRec, medic, patient }
}

/**
 * Delete a medical record instance
 * @param client
 * @param token
 * @param medic
 * @param medRec
 */
export async function delMedRec(
  client: Client,
  token: string,
  medic: Medic,
  medRec: MedicalRecord
): Promise<void> {
  await client
    .delete(`/api/medicalrecord/${medRec.id}`)
    .auth(token, { type: 'bearer' })
    .expect(204)
  await client
    .delete(`/api/patient/${medRec.patientId}`)
    .auth(token, { type: 'bearer' })
    .expect(204)
  await delMedic(client, token, medic)
}
