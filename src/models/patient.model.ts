// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Antecedent } from './antecedent.model'
import { hasMany } from '@loopback/repository'
import { hasOne } from '@loopback/repository'
import { model } from '@loopback/repository'
import { Audit } from '.'
import { id } from './pg'
import { dni } from './pg'
import { date } from './pg'
import { phone } from './pg'
import { email } from './pg'
import { address } from './pg'
import { integer } from './pg'
import { passport } from './pg'
import { filename } from './pg'
import { character } from './pg'
import { MedicalRecord } from './'

@model({
  settings: {
    indexes: {
      uniquePatientDNI: {
        keys: { dni: 1 },
        options: { unique: true }
      },
      uniquePatientPassport: {
        keys: { passport: 1 },
        options: { unique: true }
      },
      uniquePatientHC: {
        keys: { hc: 1 },
        options: { unique: true }
      }
    }
  }
})
export class Patient extends Audit {
  @id() id?: number

  @dni() dni?: string

  @passport() passport?: string

  @character({ required: true, length: 10 }) hc: string

  @character({ required: true, length: 25 }) lastName: string

  @character({ required: true, length: 25 }) firstName: string

  @character({ required: true, length: 100 }) ocupation: string

  @date({ required: true }) birthday: string

  @filename() image?: string

  @phone() telephone?: string

  @phone() mobile?: string

  @email() email?: string

  @address({ required: true }) address: string

  @integer() blooType?: number

  @integer({ required: true }) sex: number

  @integer({ required: true }) civilStatus: number

  @hasOne(() => Antecedent) antecedent: Antecedent

  @hasMany(() => MedicalRecord) medicalRecords: MedicalRecord[]

  constructor(data?: Partial<Patient>) {
    super(data)
  }
}

export interface PatientRelations {
  // describe navigational properties here
}

export type PatientWithRelations = Patient & PatientRelations
