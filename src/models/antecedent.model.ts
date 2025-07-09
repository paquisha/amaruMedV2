// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { model } from '@loopback/repository'
import { character } from './pg'
import { integer } from './pg'
import { id } from './pg'
import { Audit } from '.'

@model({
  settings: {
    foreignKeys: {
      fkPatientAntecedent: {
        name: 'fk_antecedent_patient',
        entity: 'Patient',
        entityKey: 'id',
        foreignKey: 'patientid'
      }
    }
  }
})
export class Antecedent extends Audit {
  @id() id?: number

  @character({ length: 200 }) personal?: string

  @character({ length: 200 }) surgical?: string

  @character({ length: 200 }) family?: string

  @character({ length: 200 }) professional?: string

  @character({ length: 200 }) habits?: string

  @character({ length: 200 }) clinician?: string

  @character({ length: 200 }) trauma?: string

  @character({ length: 200 }) allergy?: string

  @character({ length: 200 }) ago?: string

  @integer({ required: true }) patientId: number

  constructor(data?: Partial<Antecedent>) {
    super(data)
  }
}

export interface AntecedentRelations {
  // describe navigational properties here
}

export type AntecedentWithRelations = Antecedent & AntecedentRelations
