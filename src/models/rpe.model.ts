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
 * REGIONAL PHYSICAL EXAM
 */
@model({
  settings: {
    foreignKeys: {
      fkRPEMedRec: {
        name: 'fk_rpe_medrec',
        entity: 'MedicalRecord',
        entityKey: 'id',
        foreignKey: 'medicalrecordid'
      }
    }
  }
})
export class Rpe extends Audit {
  @id() id?: number

  @boolean({ default: false }) head?: boolean

  @boolean({ default: false }) neck?: boolean

  @boolean({ default: false }) chest?: boolean

  @boolean({ default: false }) abdomen?: boolean

  @boolean({ default: false }) pelvis?: boolean

  @boolean({ default: false }) extremities?: boolean

  @text() observations?: string

  @integer({ required: true }) medicalRecordId?: number

  constructor(data?: Partial<Rpe>) {
    super(data)
  }
}

export interface RpeRelations {
  // describe navigational properties here
}

export type RpeWithRelations = Rpe & RpeRelations
