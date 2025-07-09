// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { hasOne, hasMany } from '@loopback/repository'
import { MedicalExam } from './medical-exam.model'
import { Diagnostic } from './diagnostic.model'
import { VitalSign } from './vital-sign.model'
import { model } from '@loopback/repository'
import { Disease } from './disease.model'
import { Exam } from './exam.model'
import { character } from './pg'
import { integer } from './pg'
import { boolean } from './pg'
import { text } from './pg'
import { id } from './pg'
import { Audit } from '.'
import { Rpe } from './rpe.model'
import { Cros } from './cros.model'

@model({
  settings: {
    foreignKeys: {
      fkMedRecPatient: {
        name: 'fk_medrec_patient',
        entity: 'Patient',
        entityKey: 'id',
        foreignKey: 'patientid'
      },
      fkMedRecMedic: {
        name: 'fk_medrec_medic',
        entity: 'Medic',
        entityKey: 'id',
        foreignKey: 'medicid'
      }
    }
  }
})
export class MedicalRecord extends Audit {
  @id() id?: number

  @character({ length: 200 }) reason: string

  @text() currentIllness?: string

  @boolean({ default: false }) done: boolean

  @boolean({ default: false }) canceled: boolean

  @integer({ required: true }) medicId?: number

  @integer({ required: true }) patientId: number

  @hasOne(() => Rpe) rpe: Rpe

  @hasOne(() => Cros) cros: Cros

  @hasOne(() => VitalSign) vitalSign: VitalSign

  @hasMany(() => Exam, { through: { model: () => MedicalExam } })
  exams: Exam[]

  @hasMany(() => Disease, { through: { model: () => Diagnostic } })
  diseases: Disease[]

  constructor(data?: Partial<MedicalRecord>) {
    super(data)
  }
}

export interface MedicalRecordRelations {
  // describe navigational properties here
}

export type MedicalRecordWithRelations = MedicalRecord & MedicalRecordRelations
