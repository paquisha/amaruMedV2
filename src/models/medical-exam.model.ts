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
      fkMedExamMedRec: {
        name: 'fk_medexam_medrec',
        entity: 'MedicalRecord',
        entityKey: 'id',
        foreignKey: 'medicalrecordid'
      },
      fkMedExamDisease: {
        name: 'fk_medexam_exam',
        entity: 'Exam',
        entityKey: 'id',
        foreignKey: 'examid'
      }
    }
  },
  indexes: {
    uniqueMedExamCombination: {
      keys: { medicalRecordId: 1, examId: 1 },
      options: { unique: true }
    }
  }
})
export class MedicalExam extends Audit {
  @id() id?: number

  @integer({ required: true }) medicalRecordId: number

  @integer({ required: true }) examId: number

  constructor(data?: Partial<MedicalExam>) {
    super(data)
  }
}

export interface MedicalExamRelations {
  // describe navigational properties here
}

export type MedicalExamWithRelations = MedicalExam & MedicalExamRelations
