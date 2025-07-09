// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { authenticate } from '@loopback/authentication'
import { repository } from '@loopback/repository'
import { ExamRepository } from '../repositories'
import { param, get } from '@loopback/rest'
import { Exam, ExamType } from '../models'
import spec from './specs/exam-type.specs'

@authenticate('jwt')
export class ExamExamTypeController {
  constructor(@repository(ExamRepository) public examRepository: ExamRepository) {}

  @get('/api/exam/{id}/examtype', spec.responseOne())
  async getExamType(
    @param.path.number('id') id: typeof Exam.prototype.id
  ): Promise<ExamType> {
    return this.examRepository.examType(id)
  }
}
