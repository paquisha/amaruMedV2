// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { MedicalRecordRepository } from '../repositories'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { repository } from '@loopback/repository'
import { UserProfile } from '@loopback/security'
import { MedicalRecord, Cros } from '../models'
import { Filter } from '@loopback/repository'
import { AccountService } from '../services'
import { requestBody } from '@loopback/rest'
import { AccountBindings } from '../keys'
import { inject } from '@loopback/core'
import { param } from '@loopback/rest'
import { post } from '@loopback/rest'
import { get } from '@loopback/rest'
import spec from './specs/Cros.specs'

@authenticate('jwt')
export class MedicalRecordCrosController {
  constructor(
    @repository(MedicalRecordRepository) protected medRecRepo: MedicalRecordRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get('/api/medicalrecord/{id}/cros', spec.responseOne('MedicalRecord has one Cros'))
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Cros>
  ): Promise<Cros> {
    return this.medRecRepo.cros(id).get(filter)
  }

  @post('/api/medicalrecord/{id}/cros', spec.responseOne())
  async create(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: typeof MedicalRecord.prototype.id,
    @requestBody(spec.requestBody()) cros: Omit<Cros, 'id'>
  ): Promise<Cros> {
    cros.createdAt = new Date().toLocaleString()
    cros.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    return this.medRecRepo.cros(id).create(cros)
  }
}
