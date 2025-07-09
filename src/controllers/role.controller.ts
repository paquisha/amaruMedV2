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
import { RoleRepository } from '../repositories'
import { Where } from '@loopback/repository'
import { post } from '@loopback/rest'
import { param } from '@loopback/rest'
import { get } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { del } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { Role } from '../models'
import { AccountBindings } from '../keys'
import { AccountService } from '../services'
import spec from './specs/role.specs'

@authenticate('jwt')
export class RoleController {
  constructor(
    @repository(RoleRepository) public roleRepo: RoleRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @post('/api/role', spec.responseOne())
  async create(
    @requestBody(spec.requestBody()) role: Omit<Role, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<Role> {
    role.createdAt = new Date().toLocaleString()
    role.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    return this.roleRepo.create(role)
  }

  @get('/api/roles/count', spec.responseCount())
  async count(@param.where(Role) where?: Where<Role>): Promise<Count> {
    return this.roleRepo.count(where)
  }

  @get('/api/roles', spec.responseList())
  async find(@param.filter(Role) filter?: Filter<Role>): Promise<Role[]> {
    return this.roleRepo.find(filter)
  }

  @patch('/api/roles', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) role: Role,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(Role) where?: Where<Role>
  ): Promise<Count> {
    role.editedAt = new Date().toLocaleString()
    role.editedBy = (await this.acountService.convertToUser(session)).id
    return this.roleRepo.updateAll(role, where)
  }

  @get('/api/role/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Role, { exclude: 'where' })
    filter?: FilterExcludingWhere<Role>
  ): Promise<Role> {
    return this.roleRepo.findById(id, filter)
  }

  @patch('/api/role/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) role: Role,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    role.editedAt = new Date().toLocaleString()
    role.editedBy = (await this.acountService.convertToUser(session)).id
    await this.roleRepo.updateById(id, role)
  }

  @del('/api/role/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    try {
      await this.roleRepo.deleteById(id)
    } catch (err) {
      await this.roleRepo.updateById(id, {
        deleted: true,
        deletedBy: (await this.acountService.convertToUser(session)).id,
        deletedAt: new Date().toLocaleString()
      })
    }
  }
}
