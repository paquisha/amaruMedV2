// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { FilterExcludingWhere } from '@loopback/repository'
import { authenticate } from '@loopback/authentication'
import { AntecedentRepository } from '../repositories'
import { SecurityBindings } from '@loopback/security'
import { repository } from '@loopback/repository'
import { UserProfile } from '@loopback/security'
import { Filter } from '@loopback/repository'
import { Count } from '@loopback/repository'
import { Where } from '@loopback/repository'
import { requestBody } from '@loopback/rest'
import { AccountService } from '../services'
import spec from './specs/antecedent.specs'
import { AccountBindings } from '../keys'
import { inject } from '@loopback/core'
import { Antecedent } from '../models'
import { param } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { get } from '@loopback/rest'
import { del } from '@loopback/rest'

@authenticate('jwt')
export class AntecedentController {
  constructor(
    @repository(AntecedentRepository) public antecedentRepo: AntecedentRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get('/api/antecedents/count', spec.responseCount())
  async count(@param.where(Antecedent) where?: Where<Antecedent>): Promise<Count> {
    return this.antecedentRepo.count(where)
  }

  @get('/api/antecedents', spec.responseList())
  async find(
    @param.filter(Antecedent) filter?: Filter<Antecedent>
  ): Promise<Antecedent[]> {
    return this.antecedentRepo.find(filter)
  }

  @patch('/api/antecedents', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) antecedent: Antecedent,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(Antecedent) where?: Where<Antecedent>
  ): Promise<Count> {
    antecedent.editedAt = new Date().toLocaleString()
    antecedent.editedBy = (await this.acountService.convertToUser(session)).id
    return this.antecedentRepo.updateAll(antecedent, where)
  }

  @get('/api/antecedent/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Antecedent, { exclude: 'where' })
    filter?: FilterExcludingWhere<Antecedent>
  ): Promise<Antecedent> {
    return this.antecedentRepo.findById(id, filter)
  }

  @patch('/api/antecedent/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) antecedent: Antecedent,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    antecedent.editedAt = new Date().toLocaleString()
    antecedent.editedBy = (await this.acountService.convertToUser(session)).id
    await this.antecedentRepo.updateById(id, antecedent)
  }

  @del('/api/antecedent/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    try {
      await this.antecedentRepo.deleteById(id)
    } catch (error) {
      await this.antecedentRepo.updateById(id, {
        deleted: true,
        deletedBy: (await this.acountService.convertToUser(session)).id,
        deletedAt: new Date().toLocaleString()
      })
    }
  }
}
