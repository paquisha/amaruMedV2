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
import { DiseaseTypeRepository } from '../repositories'
import { UserRepository } from '../repositories'
import { Where } from '@loopback/repository'
import { param } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { post } from '@loopback/rest'
import { get } from '@loopback/rest'
import { del } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { DiseaseType } from '../models'
import { AccountBindings } from '../keys'
import { AccountService } from '../services'
import spec from './specs/disease-type.specs'

@authenticate('jwt')
export class DiseaseTypeController {
  constructor(
    @repository(UserRepository) public userRepo: UserRepository,
    @repository(DiseaseTypeRepository) public diseaseTypeRepo: DiseaseTypeRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @post('/api/diseasetype', spec.responseOne())
  async create(
    @requestBody(spec.requestBody()) diseaseType: Omit<DiseaseType, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<DiseaseType> {
    diseaseType.createdAt = new Date().toLocaleString()
    diseaseType.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    return this.diseaseTypeRepo.create(diseaseType)
  }

  @get('/api/diseasetypes/count', spec.responseCount())
  async count(@param.where(DiseaseType) where?: Where<DiseaseType>): Promise<Count> {
    return this.diseaseTypeRepo.count(where)
  }

  @get('/api/diseasetypes', spec.responseList())
  async find(
    @param.filter(DiseaseType) filter?: Filter<DiseaseType>
  ): Promise<DiseaseType[]> {
    return this.diseaseTypeRepo.find(filter)
  }

  @patch('/api/diseasetypes', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) diseaseType: DiseaseType,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(DiseaseType) where?: Where<DiseaseType>
  ): Promise<Count> {
    diseaseType.editedAt = new Date().toLocaleString()
    diseaseType.editedBy = (await this.acountService.convertToUser(session)).id
    return this.diseaseTypeRepo.updateAll(diseaseType, where)
  }

  @get('/api/diseasetype/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(DiseaseType, { exclude: 'where' })
    filter?: FilterExcludingWhere<DiseaseType>
  ): Promise<DiseaseType> {
    return this.diseaseTypeRepo.findById(id, filter)
  }

  @patch('/api/diseasetype/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) diseaseType: DiseaseType,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    diseaseType.editedAt = new Date().toLocaleString()
    diseaseType.editedBy = (await this.acountService.convertToUser(session)).id
    await this.diseaseTypeRepo.updateById(id, diseaseType)
  }

  @del('/api/diseasetype/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    try {
      await this.diseaseTypeRepo.deleteById(id)
    } catch (err) {
      await this.diseaseTypeRepo.updateById(id, {
        deleted: true,
        deletedBy: (await this.acountService.convertToUser(session)).id,
        deletedAt: new Date().toLocaleString()
      })
    }
  }
}
