// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/core'
import { UserProfile } from '@loopback/security'
import { SecurityBindings } from '@loopback/security'
import { authenticate } from '@loopback/authentication'
import { repository } from '@loopback/repository'
import { Filter } from '@loopback/repository'
import { requestBody } from '@loopback/rest'
import { param } from '@loopback/rest'
import { post } from '@loopback/rest'
import { get } from '@loopback/rest'
import { ExamTypeRepository } from '../repositories'
import { AccountService } from '../services'
import { AccountBindings } from '../keys'
import { ExamType } from '../models'
import { Exam } from '../models'
import spec from './specs/exam.specs'

@authenticate('jwt')
export class ExamTypeExamController {
  constructor(
    @repository(ExamTypeRepository) protected examTypeRepository: ExamTypeRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get('/api/examtype/{id}/exams', spec.responseList())
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Exam>
  ): Promise<Exam[]> {
    return this.examTypeRepository.exams(id).find(filter)
  }

  @post('/api/examtype/{id}/exam', spec.responseOne())
  async create(
    @param.path.number('id') id: typeof ExamType.prototype.id,
    @requestBody(spec.requestBody()) exam: Omit<Exam, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<Exam> {
    exam.createdAt = new Date().toLocaleString()
    exam.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    return this.examTypeRepository.exams(id).create(exam)
  }
}
