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
import { DiseaseRepository } from '../repositories'
import { Where } from '@loopback/repository'
import { requestBody } from '@loopback/rest'
import { param } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { get } from '@loopback/rest'
import { del } from '@loopback/rest'
import { AccountService } from '../services'
import { AccountBindings } from '../keys'
import { Disease } from '../models'
import spec from './specs/disease.specs'

@authenticate('jwt')
export class DiseaseController {
  constructor(
    @repository(DiseaseRepository) public diseaseRepo: DiseaseRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get('/api/diseases/count', spec.responseCount())
  async count(@param.where(Disease) where?: Where<Disease>): Promise<Count> {
    return this.diseaseRepo.count(where)
  }

  @get('/api/diseases', spec.responseList(undefined, true))
  async find(@param.filter(Disease) filter?: Filter<Disease>): Promise<Disease[]> {
    return this.diseaseRepo.find(filter)
  }

  @patch('/api/diseases', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) disease: Disease,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(Disease) where?: Where<Disease>
  ): Promise<Count> {
    disease.editedAt = new Date().toLocaleString()
    disease.editedBy = (await this.acountService.convertToUser(session)).id
    return this.diseaseRepo.updateAll(disease, where)
  }

  @get('/api/disease/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Disease, { exclude: 'where' })
    filter?: FilterExcludingWhere<Disease>
  ): Promise<Disease> {
    return this.diseaseRepo.findById(id, filter)
  }

  @patch('/api/disease/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) disease: Disease,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    disease.editedAt = new Date().toLocaleString()
    disease.editedBy = (await this.acountService.convertToUser(session)).id
    await this.diseaseRepo.updateById(id, disease)
  }

  @del('/api/disease/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    try {
      await this.diseaseRepo.deleteById(id)
    } catch (error) {
      await this.diseaseRepo.updateById(id, {
        deleted: true,
        deletedBy: (await this.acountService.convertToUser(session)).id,
        deletedAt: new Date().toLocaleString()
      })
    }
  }
}
