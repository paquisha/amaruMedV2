// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { authenticate } from '@loopback/authentication'
import { UserProfile } from '@loopback/security'
import { SecurityBindings } from '@loopback/security'
import { inject } from '@loopback/core'
import { Count } from '@loopback/repository'
import { Filter } from '@loopback/repository'
import { FilterExcludingWhere } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { ExamRepository } from '../repositories'
import { Where } from '@loopback/repository'
import { requestBody } from '@loopback/rest'
import { param } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { get } from '@loopback/rest'
import { del } from '@loopback/rest'
import { AccountService } from '../services'
import { AccountBindings } from '../keys'
import { Exam } from '../models'
import spec from './specs/exam.specs'

@authenticate('jwt')
export class ExamController {
  constructor(
    @repository(ExamRepository) public examRepo: ExamRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get('/api/exams/count', spec.responseCount())
  async count(@param.where(Exam) where?: Where<Exam>): Promise<Count> {
    return this.examRepo.count(where)
  }

  @get('/api/exams', spec.responseList(undefined, true))
  async find(@param.filter(Exam) filter?: Filter<Exam>): Promise<Exam[]> {
    return this.examRepo.find(filter)
  }

  @patch('/api/exams', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) exam: Exam,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(Exam) where?: Where<Exam>
  ): Promise<Count> {
    exam.editedAt = new Date().toLocaleString()
    exam.editedBy = (await this.acountService.convertToUser(session)).id
    return this.examRepo.updateAll(exam, where)
  }

  @get('/api/exam/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Exam, { exclude: 'where' })
    filter?: FilterExcludingWhere<Exam>
  ): Promise<Exam> {
    return this.examRepo.findById(id, filter)
  }

  @patch('/api/exam/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) exam: Exam,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    exam.editedAt = new Date().toLocaleString()
    exam.editedBy = (await this.acountService.convertToUser(session)).id
    await this.examRepo.updateById(id, exam)
  }

  @del('/api/exam/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    try {
      await this.examRepo.deleteById(id)
    } catch (error) {
      await this.examRepo.updateById(id, {
        deleted: true,
        deletedBy: (await this.acountService.convertToUser(session)).id,
        deletedAt: new Date().toLocaleString()
      })
    }
  }
}
