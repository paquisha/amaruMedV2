// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { MedicalRecordRepository, MedicalExamRepository } from '../repositories'
import { Filter, repository, Count } from '@loopback/repository'
import { get, param, post, requestBody } from '@loopback/rest'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import medExamSpec from './specs/medical-exam.specs'
import { UserProfile } from '@loopback/security'
import examSpec from './specs/exam.specs'
import { Exam, MedicalExam } from '../models'
import { AccountService } from '../services'
import { AccountBindings } from '../keys'
import { inject } from '@loopback/core'

@authenticate('jwt')
export class MedicalRecordExamController {
  constructor(
    @repository(MedicalRecordRepository) protected medRecRepo: MedicalRecordRepository,
    @repository(MedicalExamRepository) protected medExamRepo: MedicalExamRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get(
    '/api/medicalrecord/{id}/medicalexams',
    examSpec.responseList('Array of MedicalRecord has many Exam through MedicalExam')
  )
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Exam>
  ): Promise<Exam[]> {
    return this.medRecRepo.exams(id).find(filter)
  }

  @post(
    '/api/medicalrecord/{id}/medicalexams',
    medExamSpec.responseCount('Recorded medical exams')
  )
  async create(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) session: UserProfile,
    @requestBody(medExamSpec.requestBody()) medExams: MedicalExam[]
  ): Promise<Count> {
    const createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    medExams.map(item => {
      item.medicalRecordId = id
      item.createdBy = createdBy
      item.createdAt = new Date().toLocaleString()
    })
    const result = await this.medExamRepo.createAll(medExams)
    return { count: result.length }
  }
}
