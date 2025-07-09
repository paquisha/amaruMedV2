// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/core'
import { UserProfile } from '@loopback/security'
import { SecurityBindings } from '@loopback/security'
import { authenticate } from '@loopback/authentication'
import { repository } from '@loopback/repository'
import { Filter } from '@loopback/repository'
import { requestBody } from '@loopback/rest'
import { param } from '@loopback/rest'
import { post } from '@loopback/rest'
import { get } from '@loopback/rest'
import { DiseaseTypeRepository } from '../repositories'
import { AccountService } from '../services'
import { AccountBindings } from '../keys'
import { DiseaseType } from '../models'
import { Disease } from '../models'
import spec from './specs/disease.specs'

@authenticate('jwt')
export class DiseaseTypeDiseaseController {
  constructor(
    @repository(DiseaseTypeRepository)
    protected diseaseTypeRepository: DiseaseTypeRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get('/api/diseasetype/{id}/diseases', spec.responseList())
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Disease>
  ): Promise<Disease[]> {
    return this.diseaseTypeRepository.diseases(id).find(filter)
  }

  @post('/api/diseasetype/{id}/disease', spec.responseOne())
  async create(
    @param.path.number('id') id: typeof DiseaseType.prototype.id,
    @requestBody(spec.requestBody()) disease: Omit<Disease, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<Disease> {
    disease.createdAt = new Date().toLocaleString()
    disease.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    return this.diseaseTypeRepository.diseases(id).create(disease)
  }
}
