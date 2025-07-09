// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { belongsTo } from '@loopback/repository'
import { model } from '@loopback/repository'
import { ExamType } from './exam-type.model'
import { character } from './pg'
import { id } from './pg'
import { Audit } from '.'

@model({
  settings: {
    foreignKeys: {
      fkUserRole: {
        name: 'fk_exam_examtype',
        entity: 'ExamType',
        entityKey: 'id',
        foreignKey: 'examtypeid'
      }
    }
  }
})
export class Exam extends Audit {
  @id() id?: number

  @character({ length: 100, required: true }) name: string

  @belongsTo(() => ExamType, {}, { required: true }) examTypeId: number

  constructor(data?: Partial<Exam>) {
    super(data)
  }
}

export interface ExamRelations {
  // describe navigational properties here
}

export type ExamWithRelations = Exam & ExamRelations
