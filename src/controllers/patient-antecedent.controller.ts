// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Filter, repository } from '@loopback/repository'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { PatientRepository } from '../repositories'
import { UserProfile } from '@loopback/security'
import { Patient, Antecedent } from '../models'
import { AccountService } from '../services'
import { requestBody } from '@loopback/rest'
import spec from './specs/antecedent.specs'
import { AccountBindings } from '../keys'
import { inject } from '@loopback/core'
import { param } from '@loopback/rest'
import { post } from '@loopback/rest'
import { get } from '@loopback/rest'

@authenticate('jwt')
export class PatientAntecedentController {
  constructor(
    @repository(PatientRepository) protected patientRepository: PatientRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get('/api/patient/{id}/antecedent', spec.responseOne('Patient has one Antecedent'))
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Antecedent>
  ): Promise<Antecedent> {
    return this.patientRepository.antecedent(id).get(filter)
  }

  @post('/api/patient/{id}/antecedent', spec.responseOne())
  async create(
    @param.path.number('id') id: typeof Patient.prototype.id,
    @requestBody(spec.requestBody()) antecedent: Omit<Antecedent, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<Antecedent> {
    antecedent.createdAt = new Date().toLocaleString()
    antecedent.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    return this.patientRepository.antecedent(id).create(antecedent)
  }
}
