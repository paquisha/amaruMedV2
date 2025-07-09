// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { MedicalSpecialty } from './medical-specialty.model'
import { MedicalRecord } from './medical-record.model'
import { hasMany } from '@loopback/repository'
import { model } from '@loopback/repository'
import { character } from './pg'

import { filename } from './pg'
import { passport } from './pg'
import { address } from './pg'
import { Specialist } from '.'
import { integer } from './pg'
import { phone } from './pg'
import { email } from './pg'
import { dni } from './pg'
import { id } from './pg'
import { Audit } from '.'

@model({
  settings: {
    foreignKeys: {
      fkMedicUser: {
        name: 'fk_medic_user',
        entity: 'tuser',
        entityKey: 'id',
        foreignKey: 'userid'
      }
    },
    indexes: {
      uniqueMedicUser: {
        keys: { userId: 1 },
        options: { unique: true }
      }
    }
  }
})
export class Medic extends Audit {
  @id() id?: number

  @dni() dni?: string

  @passport() passport?: string

  @character({ required: true, length: 25 }) lastName: string

  @character({ required: true, length: 25 }) firstName: string

  @filename() image?: string

  @phone() telephone?: string

  @phone() mobile?: string

  @email() email?: string

  @address({ required: true }) address: string

  @character({ length: 15 }) regProfessional?: string

  @integer() userId?: number

  @hasMany(() => MedicalRecord) medicalRecords: MedicalRecord[]

  @hasMany(() => MedicalSpecialty, { through: { model: () => Specialist } })
  medicalSpecialties: MedicalSpecialty[]

  constructor(data?: Partial<Medic>) {
    super(data)
  }
}

export interface MedicRelations {
  // describe navigational properties here
}

export type MedicWithRelations = Medic & MedicRelations
