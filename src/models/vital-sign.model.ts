// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { model } from '@loopback/repository'
import { character, integer } from './pg'
import { id } from './pg'
import { Audit } from '.'

@model({
  settings: {
    foreignKeys: {
      fkSignMedRec: {
        name: 'fk_sign_medrec',
        entity: 'MedicalRecord',
        entityKey: 'id',
        foreignKey: 'medicalrecordid'
      }
    }
  }
})
export class VitalSign extends Audit {
  @id() id?: number

  @character({ length: 6, required: true }) temperature: string

  @character({ length: 6, required: true }) systolicPressure: string

  @character({ length: 6, required: true }) diastolicPressure: string

  @character({ length: 6, required: true }) pulse: string

  @character({ length: 6, required: true }) breathingFrequency: string

  @character({ length: 6, required: true }) oxygenSaturation: string

  @character({ length: 6, required: true }) tall: string

  @character({ length: 6, required: true }) weight: string

  @character({ length: 6, required: true }) mass: string

  @integer({ required: true }) medicalRecordId?: number

  constructor(data?: Partial<VitalSign>) {
    super(data)
  }
}

export interface VitalSignRelations {
  // describe navigational properties here
}

export type VitalSignWithRelations = VitalSign & VitalSignRelations
