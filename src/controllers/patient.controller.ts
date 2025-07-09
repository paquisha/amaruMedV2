// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { FilterExcludingWhere } from '@loopback/repository'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { PatientRepository } from '../repositories'
import { repository } from '@loopback/repository'
import { UserProfile } from '@loopback/security'
import { Filter } from '@loopback/repository'
import { AccountService } from '../services'
import { requestBody } from '@loopback/rest'
import { Where } from '@loopback/repository'
import { Count } from '@loopback/repository'
import { AccountBindings } from '../keys'
import spec from './specs/patient.specs'
import { inject } from '@loopback/core'
import { patch } from '@loopback/rest'
import { param } from '@loopback/rest'
import { post } from '@loopback/rest'
import { get } from '@loopback/rest'
import { del } from '@loopback/rest'
import { Patient } from '../models'

@authenticate('jwt')
export class PatientController {
  constructor(
    @repository(PatientRepository) public patientRepo: PatientRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @post('/api/patient', spec.responseOne())
  async create(
    @requestBody(spec.requestBody()) patient: Omit<Patient, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<Patient> {
    patient.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    patient.createdAt = new Date().toLocaleString()
    return this.patientRepo.create(patient)
  }

  @get('/api/patients/count', spec.responseCount())
  async count(@param.where(Patient) where?: Where<Patient>): Promise<Count> {
    return this.patientRepo.count(where)
  }

  @get('/api/patients', spec.responseList())
  async find(@param.filter(Patient) filter?: Filter<Patient>): Promise<Patient[]> {
    return this.patientRepo.find(filter)
  }

  @patch('/api/patients', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) patient: Patient,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(Patient) where?: Where<Patient>
  ): Promise<Count> {
    patient.editedAt = new Date().toLocaleString()
    patient.editedBy = (await this.acountService.convertToUser(session)).id
    return this.patientRepo.updateAll(patient, where)
  }

  @get('/api/patient/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Patient, { exclude: 'where' })
    filter?: FilterExcludingWhere<Patient>
  ): Promise<Patient> {
    return this.patientRepo.findById(id, filter)
  }

  @patch('/api/patient/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) patient: Patient,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    patient.editedAt = new Date().toLocaleString()
    patient.editedBy = (await this.acountService.convertToUser(session)).id
    await this.patientRepo.updateById(id, patient)
  }

  @del('/api/patient/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    try {
      await this.patientRepo.deleteById(id)
    } catch (err) {
      await this.patientRepo.updateById(id, {
        deleted: true,
        deletedBy: (await this.acountService.convertToUser(session)).id,
        deletedAt: new Date().toLocaleString()
      })
    }
  }
}
