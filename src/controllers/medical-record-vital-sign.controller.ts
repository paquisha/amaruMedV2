// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { MedicalRecord, VitalSign } from '../models'
import { MedicalRecordRepository } from '../repositories'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { repository } from '@loopback/repository'
import { UserProfile } from '@loopback/security'
import { Filter } from '@loopback/repository'
import { requestBody } from '@loopback/rest'
import { AccountService } from '../services'
import spec from './specs/vital-sign.specs'
import { AccountBindings } from '../keys'
import { inject } from '@loopback/core'
import { post } from '@loopback/rest'
import { param } from '@loopback/rest'
import { get } from '@loopback/rest'

@authenticate('jwt')
export class MedicalRecordVitalSignController {
  constructor(
    @repository(MedicalRecordRepository)
    protected medicalRecordRepository: MedicalRecordRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get(
    '/api/medicalrecord/{id}/vitalsign',
    spec.responseOne('MedicalRecord has one VitalSign')
  )
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<VitalSign>
  ): Promise<VitalSign> {
    return this.medicalRecordRepository.vitalSign(id).get(filter)
  }

  @post(
    '/api/medicalrecord/{id}/vitalsign',
    spec.responseOne('MedicalRecord model instance')
  )
  async create(
    @param.path.number('id') id: typeof MedicalRecord.prototype.id,
    @requestBody(spec.requestBody()) vitalSign: Omit<VitalSign, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<VitalSign> {
    vitalSign.createdAt = new Date().toLocaleString()
    vitalSign.createdBy = (await this.acountService.convertToUser(session)).id ?? 0

    return this.medicalRecordRepository.vitalSign(id).create(vitalSign)
  }
}
