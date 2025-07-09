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
import { ExamTypeRepository } from '../repositories'
import { UserRepository } from '../repositories'
import { Where } from '@loopback/repository'
import { param } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { post } from '@loopback/rest'
import { get } from '@loopback/rest'
import { del } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { ExamType } from '../models'
import { AccountBindings } from '../keys'
import { AccountService } from '../services'
import spec from './specs/exam-type.specs'

@authenticate('jwt')
export class ExamTypeController {
  constructor(
    @repository(UserRepository) public userRepo: UserRepository,
    @repository(ExamTypeRepository) public examTypeRepo: ExamTypeRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @post('/api/examtype', spec.responseOne())
  async create(
    @requestBody(spec.requestBody()) examType: Omit<ExamType, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<ExamType> {
    examType.createdAt = new Date().toLocaleString()
    examType.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    return this.examTypeRepo.create(examType)
  }

  @get('/api/examtypes/count', spec.responseCount())
  async count(@param.where(ExamType) where?: Where<ExamType>): Promise<Count> {
    return this.examTypeRepo.count(where)
  }

  @get('/api/examtypes', spec.responseList())
  async find(@param.filter(ExamType) filter?: Filter<ExamType>): Promise<ExamType[]> {
    return this.examTypeRepo.find(filter)
  }

  @patch('/api/examtypes', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) examType: ExamType,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(ExamType) where?: Where<ExamType>
  ): Promise<Count> {
    examType.editedAt = new Date().toLocaleString()
    examType.editedBy = (await this.acountService.convertToUser(session)).id
    return this.examTypeRepo.updateAll(examType, where)
  }

  @get('/api/examtype/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ExamType, { exclude: 'where' })
    filter?: FilterExcludingWhere<ExamType>
  ): Promise<ExamType> {
    return this.examTypeRepo.findById(id, filter)
  }

  @patch('/api/examtype/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) examType: ExamType,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    examType.editedAt = new Date().toLocaleString()
    examType.editedBy = (await this.acountService.convertToUser(session)).id
    await this.examTypeRepo.updateById(id, examType)
  }

  @del('/api/examtype/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    try {
      await this.examTypeRepo.deleteById(id)
    } catch (err) {
      await this.examTypeRepo.updateById(id, {
        deleted: true,
        deletedBy: (await this.acountService.convertToUser(session)).id,
        deletedAt: new Date().toLocaleString()
      })
    }
  }
}
