// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { hasMany } from '@loopback/repository'
import { model } from '@loopback/repository'
import { Exam } from './exam.model'
import { character } from './pg'
import { id } from './pg'
import { Audit } from '.'

@model()
export class ExamType extends Audit {
  @id() id?: number

  @character({ length: 50, required: true }) name: string

  @hasMany(() => Exam) exams: Exam[]

  constructor(data?: Partial<ExamType>) {
    super(data)
  }
}

export interface ExamTypeRelations {
  // describe navigational properties here
}

export type ExamTypeWithRelations = ExamType & ExamTypeRelations
