// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { FilterExcludingWhere } from '@loopback/repository'
import { authenticate } from '@loopback/authentication'
import { MedicalRecordRepository } from '../repositories'
import { SecurityBindings } from '@loopback/security'
import { repository } from '@loopback/repository'
import { UserProfile } from '@loopback/security'
import { Filter } from '@loopback/repository'
import { Count } from '@loopback/repository'
import { Where } from '@loopback/repository'
import { requestBody } from '@loopback/rest'
import { AccountService } from '../services'
import spec from './specs/medical-record.specs'
import { AccountBindings } from '../keys'
import { inject } from '@loopback/core'
import { MedicalRecord } from '../models'
import { param } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { get } from '@loopback/rest'
import { del } from '@loopback/rest'

@authenticate('jwt')
export class MedicalRecordController {
  constructor(
    @repository(MedicalRecordRepository)
    public medicalRecordRepo: MedicalRecordRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get('/api/medicalrecords/count', spec.responseCount())
  async count(@param.where(MedicalRecord) where?: Where<MedicalRecord>): Promise<Count> {
    return this.medicalRecordRepo.count(where)
  }

  @get('/api/medicalrecords', spec.responseList())
  async find(
    @param.filter(MedicalRecord) filter?: Filter<MedicalRecord>
  ): Promise<MedicalRecord[]> {
    return this.medicalRecordRepo.find(filter)
  }

  @patch('/api/medicalrecords', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) medicalRecord: MedicalRecord,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(MedicalRecord) where?: Where<MedicalRecord>
  ): Promise<Count> {
    medicalRecord.editedAt = new Date().toLocaleString()
    medicalRecord.editedBy = (await this.acountService.convertToUser(session)).id
    return this.medicalRecordRepo.updateAll(medicalRecord, where)
  }

  @get('/api/medicalrecord/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MedicalRecord, { exclude: 'where' })
    filter?: FilterExcludingWhere<MedicalRecord>
  ): Promise<MedicalRecord> {
    return this.medicalRecordRepo.findById(id, filter)
  }

  @patch('/api/medicalrecord/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) medicalRecord: MedicalRecord,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    medicalRecord.editedAt = new Date().toLocaleString()
    medicalRecord.editedBy = (await this.acountService.convertToUser(session)).id
    await this.medicalRecordRepo.updateById(id, medicalRecord)
  }

  @del('/api/medicalrecord/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    try {
      await this.medicalRecordRepo.deleteById(id)
    } catch (error) {
      await this.medicalRecordRepo.updateById(id, {
        deleted: true,
        deletedBy: (await this.acountService.convertToUser(session)).id,
        deletedAt: new Date().toLocaleString()
      })
    }
  }
}
