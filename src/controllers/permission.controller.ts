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
import { PermissionRepository } from '../repositories'
import { Where } from '@loopback/repository'
import { post } from '@loopback/rest'
import { param } from '@loopback/rest'
import { get } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { del } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { Permission } from '../models'
import { AccountBindings } from '../keys'
import { AccountService } from '../services'
import spec from './specs/permission.specs'

@authenticate('jwt')
export class PermissionController {
  constructor(
    @repository(PermissionRepository) public permissionRepo: PermissionRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @post('/api/permission', spec.responseOne())
  async create(
    @requestBody(spec.requestBody()) permission: Omit<Permission, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<Permission> {
    permission.createdAt = new Date().toLocaleString()
    permission.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    return this.permissionRepo.create(permission)
  }

  @get('/api/permissions/count', spec.responseCount())
  async count(@param.where(Permission) where?: Where<Permission>): Promise<Count> {
    return this.permissionRepo.count(where)
  }

  @get('/api/permissions', spec.responseList())
  async find(
    @param.filter(Permission) filter?: Filter<Permission>
  ): Promise<Permission[]> {
    return this.permissionRepo.find(filter)
  }

  @patch('/api/permissions', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) permission: Permission,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(Permission) where?: Where<Permission>
  ): Promise<Count> {
    permission.editedAt = new Date().toLocaleString()
    permission.editedBy = (await this.acountService.convertToUser(session)).id
    return this.permissionRepo.updateAll(permission, where)
  }

  @get('/api/permission/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Permission, { exclude: 'where' })
    filter?: FilterExcludingWhere<Permission>
  ): Promise<Permission> {
    return this.permissionRepo.findById(id, filter)
  }

  @patch('/api/permission/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) permission: Permission,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    permission.editedAt = new Date().toLocaleString()
    permission.editedBy = (await this.acountService.convertToUser(session)).id
    await this.permissionRepo.updateById(id, permission)
  }

  @del('/api/permission/{id}', spec.responseSimple('DELETE'))
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    try {
      await this.permissionRepo.deleteById(id)
    } catch (err) {
      await this.permissionRepo.updateById(id, {
        deleted: true,
        deletedBy: (await this.acountService.convertToUser(session)).id,
        deletedAt: new Date().toLocaleString()
      })
    }
  }
}
