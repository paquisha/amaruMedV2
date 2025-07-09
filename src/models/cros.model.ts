// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { model } from '@loopback/repository'
import { boolean } from './pg'
import { integer } from './pg'
import { text } from './pg'
import { id } from './pg'
import { Audit } from '.'

/**
 * CURRENT REVIEW OF ORGANS AND SYSTEMS
 */
@model({
  settings: {
    foreignKeys: {
      fkCrosMedRec: {
        name: 'fk_cros_medrec',
        entity: 'MedicalRecord',
        entityKey: 'id',
        foreignKey: 'medicalrecordid'
      }
    }
  }
})
export class Cros extends Audit {
  @id() id?: number

  @boolean({ default: false }) senseOrgans?: boolean

  @boolean({ default: false }) respiratory?: boolean

  @boolean({ default: false }) cardiovascular?: boolean

  @boolean({ default: false }) digestive?: boolean

  @boolean({ default: false }) genital?: boolean

  @boolean({ default: false }) urinary?: boolean

  @boolean({ default: false }) skeletalMuscle?: boolean

  @boolean({ default: false }) endocrine?: boolean

  @boolean({ default: false }) lymphaticHeme?: boolean

  @boolean({ default: false }) nervous?: boolean

  @text() observations?: string

  @integer({ required: true }) medicalRecordId?: number

  constructor(data?: Partial<Cros>) {
    super(data)
  }
}

export interface CrosRelations {
  // describe navigational properties here
}

export type CrosWithRelations = Cros & CrosRelations
