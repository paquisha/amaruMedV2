// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { FilterExcludingWhere } from '@loopback/repository'
import { authenticate } from '@loopback/authentication'
import { VitalSignRepository } from '../repositories'
import { SecurityBindings } from '@loopback/security'
import { repository } from '@loopback/repository'
import { UserProfile } from '@loopback/security'
import { Filter } from '@loopback/repository'
import { Count } from '@loopback/repository'
import { Where } from '@loopback/repository'
import { requestBody } from '@loopback/rest'
import { AccountService } from '../services'
import spec from './specs/vital-sign.specs'
import { AccountBindings } from '../keys'
import { inject } from '@loopback/core'
import { VitalSign } from '../models'
import { param } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { get } from '@loopback/rest'
import { del } from '@loopback/rest'

@authenticate('jwt')
export class VitalSignController {
  constructor(
    @repository(VitalSignRepository) public vitalSignRepo: VitalSignRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get('/api/vitalsigns/count', spec.responseCount())
  async count(@param.where(VitalSign) where?: Where<VitalSign>): Promise<Count> {
    return this.vitalSignRepo.count(where)
  }

  @get('/api/vitalsigns', spec.responseList())
  async find(@param.filter(VitalSign) filter?: Filter<VitalSign>): Promise<VitalSign[]> {
    return this.vitalSignRepo.find(filter)
  }

  @patch('/api/vitalsigns', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) vitalSign: VitalSign,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(VitalSign) where?: Where<VitalSign>
  ): Promise<Count> {
    vitalSign.editedAt = new Date().toLocaleString()
    vitalSign.editedBy = (await this.acountService.convertToUser(session)).id
    return this.vitalSignRepo.updateAll(vitalSign, where)
  }

  @get('/api/vitalsign/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(VitalSign, { exclude: 'where' })
    filter?: FilterExcludingWhere<VitalSign>
  ): Promise<VitalSign> {
    return this.vitalSignRepo.findById(id, filter)
  }

  @patch('/api/vitalsign/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) vitalSign: VitalSign,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    vitalSign.editedAt = new Date().toLocaleString()
    vitalSign.editedBy = (await this.acountService.convertToUser(session)).id
    await this.vitalSignRepo.updateById(id, vitalSign)
  }

  @del('/api/vitalsign/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    try {
      await this.vitalSignRepo.deleteById(id)
    } catch (error) {
      await this.vitalSignRepo.updateById(id, {
        deleted: true,
        deletedBy: (await this.acountService.convertToUser(session)).id,
        deletedAt: new Date().toLocaleString()
      })
    }
  }
}
