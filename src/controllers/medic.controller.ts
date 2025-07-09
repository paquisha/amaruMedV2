// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { FilterExcludingWhere } from '@loopback/repository'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { MedicRepository } from '../repositories'
import { repository } from '@loopback/repository'
import { UserProfile } from '@loopback/security'
import { Filter } from '@loopback/repository'
import { AccountService } from '../services'
import { requestBody } from '@loopback/rest'
import { Where } from '@loopback/repository'
import { Count } from '@loopback/repository'
import { AccountBindings } from '../keys'
import spec from './specs/medic.specs'
import { inject } from '@loopback/core'
import { patch } from '@loopback/rest'
import { param } from '@loopback/rest'
import { get } from '@loopback/rest'
import { del } from '@loopback/rest'
import { Medic } from '../models'

@authenticate('jwt')
export class MedicController {
  constructor(
    @repository(MedicRepository) public medicRepo: MedicRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get('/api/medics/count', spec.responseCount())
  async count(@param.where(Medic) where?: Where<Medic>): Promise<Count> {
    return this.medicRepo.count(where)
  }

  @get('/api/medics', spec.responseList())
  async find(@param.filter(Medic) filter?: Filter<Medic>): Promise<Medic[]> {
    return this.medicRepo.find(filter)
  }

  @patch('/api/medics', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) medic: Medic,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(Medic) where?: Where<Medic>
  ): Promise<Count> {
    medic.editedAt = new Date().toLocaleString()
    medic.editedBy = (await this.acountService.convertToUser(session)).id
    return this.medicRepo.updateAll(medic, where)
  }

  @get('/api/medic/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Medic, { exclude: 'where' })
    filter?: FilterExcludingWhere<Medic>
  ): Promise<Medic> {
    return this.medicRepo.findById(id, filter)
  }

  @patch('/api/medic/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) medic: Medic,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    medic.editedAt = new Date().toLocaleString()
    medic.editedBy = (await this.acountService.convertToUser(session)).id
    await this.medicRepo.updateById(id, medic)
  }

  @del('/api/medic/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    try {
      await this.medicRepo.deleteById(id)
    } catch (err) {
      await this.medicRepo.updateById(id, {
        deleted: true,
        deletedBy: (await this.acountService.convertToUser(session)).id,
        deletedAt: new Date().toLocaleString()
      })
    }
  }
}
