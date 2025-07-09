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
import { OptionRepository } from '../repositories'
import { Where } from '@loopback/repository'
import { post } from '@loopback/rest'
import { param } from '@loopback/rest'
import { get } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { del } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { Option } from '../models'
import { AccountBindings } from '../keys'
import { AccountService } from '../services'
import spec from './specs/option.specs'

@authenticate('jwt')
export class OptionController {
  constructor(
    @repository(OptionRepository) public optionRepo: OptionRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @post('/api/option', spec.responseOne())
  async create(
    @requestBody(spec.requestBody()) option: Omit<Option, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<Option> {
    option.createdAt = new Date().toLocaleString()
    option.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    return this.optionRepo.create(option)
  }

  @get('/api/options/count', spec.responseCount())
  async count(@param.where(Option) where?: Where<Option>): Promise<Count> {
    return this.optionRepo.count(where)
  }

  @get('/api/options', spec.responseList())
  async find(@param.filter(Option) filter?: Filter<Option>): Promise<Option[]> {
    return this.optionRepo.find(filter)
  }

  @patch('/api/options', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) option: Option,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(Option) where?: Where<Option>
  ): Promise<Count> {
    option.editedAt = new Date().toLocaleString()
    option.editedBy = (await this.acountService.convertToUser(session)).id
    return this.optionRepo.updateAll(option, where)
  }

  @get('/api/option/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Option, { exclude: 'where' })
    filter?: FilterExcludingWhere<Option>
  ): Promise<Option> {
    return this.optionRepo.findById(id, filter)
  }

  @patch('/api/option/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) option: Option,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    option.editedAt = new Date().toLocaleString()
    option.editedBy = (await this.acountService.convertToUser(session)).id
    await this.optionRepo.updateById(id, option)
  }

  @del('/api/option/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    await this.optionRepo.updateById(id, {
      deleted: true,
      deletedBy: (await this.acountService.convertToUser(session)).id,
      deletedAt: new Date().toLocaleString()
    })
  }
}
