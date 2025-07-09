// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { get, param, post, requestBody } from '@loopback/rest'
import { Filter, repository } from '@loopback/repository'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { PatientRepository } from '../repositories'
import { Patient, MedicalRecord } from '../models'
import { UserProfile } from '@loopback/security'
import spec from './specs/medical-record.specs'
import { AccountService } from '../services'
import { AccountBindings } from '../keys'
import { inject } from '@loopback/core'

@authenticate('jwt')
export class PatientMedicalRecordController {
  constructor(
    @repository(PatientRepository) protected patientRepository: PatientRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get(
    '/api/patient/{id}/medicalrecords',
    spec.responseList('Array of Patient has many MedicalRecord')
  )
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<MedicalRecord>
  ): Promise<MedicalRecord[]> {
    return this.patientRepository.medicalRecords(id).find(filter)
  }

  @post('/api/patient/{id}/medicalrecord', spec.responseOne())
  async create(
    @param.path.number('id') id: typeof Patient.prototype.id,
    @requestBody(spec.requestBody()) medicalRecord: Omit<MedicalRecord, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<MedicalRecord> {
    medicalRecord.createdAt = new Date().toLocaleString()
    medicalRecord.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    return this.patientRepository.medicalRecords(id).create(medicalRecord)
  }
}
