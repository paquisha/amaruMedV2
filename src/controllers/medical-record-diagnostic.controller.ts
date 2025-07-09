// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { MedicalRecordRepository, DiagnosticRepository } from '../repositories'
import { Filter, repository, Count } from '@loopback/repository'
import { get, param, post, requestBody } from '@loopback/rest'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import diagnosticSpec from './specs/diagnostic.specs'
import { UserProfile } from '@loopback/security'
import diseaseSpec from './specs/disease.specs'
import { Disease, Diagnostic } from '../models'
import { AccountService } from '../services'
import { AccountBindings } from '../keys'
import { inject } from '@loopback/core'

@authenticate('jwt')
export class MedicalRecordDiagnosticController {
  constructor(
    @repository(MedicalRecordRepository) protected medRecRepo: MedicalRecordRepository,
    @repository(DiagnosticRepository) protected diagnosticRepo: DiagnosticRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get(
    '/api/medicalrecord/{id}/diagnostics',
    diseaseSpec.responseList('Array of MedicalRecord has many Disease through Diagnostic')
  )
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Disease>
  ): Promise<Disease[]> {
    return this.medRecRepo.diseases(id).find(filter)
  }

  @post(
    '/api/medicalrecord/{id}/diagnostics',
    diagnosticSpec.responseCount('Recorded diagnostics')
  )
  async create(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) session: UserProfile,
    @requestBody(diagnosticSpec.requestBody()) diagnostics: Diagnostic[]
  ): Promise<Count> {
    const createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    diagnostics.map(item => {
      item.medicalRecordId = id
      item.createdBy = createdBy
      item.createdAt = new Date().toLocaleString()
    })
    const result = await this.diagnosticRepo.createAll(diagnostics)
    return { count: result.length }
  }
}
