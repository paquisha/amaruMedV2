// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/core'
import { UserProfile } from '@loopback/security'
import { SecurityBindings } from '@loopback/security'
import { authenticate } from '@loopback/authentication'
import { Filter, repository } from '@loopback/repository'
import { get, param } from '@loopback/rest'
import { Module } from '../models'
import { RoleRepository } from '../repositories'
import spec from './specs/module.specs'
import { AccountBindings } from '../keys'
import { AccountService } from '../services'

@authenticate('jwt')
export class RoleModuleController {
  constructor(
    @repository(RoleRepository) protected roleRepository: RoleRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get(
    '/api/role/{id}/modules',
    spec.responseList('Array of Role has many Module through Permission')
  )
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Module>
  ): Promise<Module[]> {
    return this.roleRepository.modules(id).find(filter)
  }

  @get(
    '/api/myrole/modules',
    spec.responseList(
      'Logged account with Array of Role has many Module through Permission'
    )
  )
  async findMyModules(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.query.object('filter') filter?: Filter<Module>
  ): Promise<Module[]> {
    const user = await this.acountService.convertToUser(session)
    return this.roleRepository.modules(user.roleId).find(filter)
  }
}
