// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { model } from '@loopback/repository'
import { integer } from './pg'
import { id } from './pg'
import { Audit } from '.'

@model({
  settings: {
    foreignKeys: {
      fkDiagnosticMedRec: {
        name: 'fk_diagnostic_medrec',
        entity: 'MedicalRecord',
        entityKey: 'id',
        foreignKey: 'medicalrecordid'
      },
      fkDiagnosticDisease: {
        name: 'fk_diagnostic_disease',
        entity: 'Disease',
        entityKey: 'id',
        foreignKey: 'diseaseid'
      }
    }
  },
  indexes: {
    uniqueDiagnosticCombination: {
      keys: { medicalRecordId: 1, diseaseId: 1 },
      options: { unique: true }
    }
  }
})
export class Diagnostic extends Audit {
  @id() id?: number

  @integer() medicalRecordId: number

  @integer() diseaseId: number

  constructor(data?: Partial<Diagnostic>) {
    super(data)
  }
}

export interface DiagnosticRelations {
  // describe navigational properties here
}

export type DiagnosticWithRelations = Diagnostic & DiagnosticRelations
