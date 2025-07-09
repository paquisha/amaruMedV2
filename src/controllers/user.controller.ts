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
import { UserRepository } from '../repositories'
import { Where } from '@loopback/repository'
import { requestBody } from '@loopback/rest'
import { param } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { get } from '@loopback/rest'
import { AccountService } from '../services'
import { AccountBindings } from '../keys'
import { User } from '../models'
import spec from './specs/user.specs'

@authenticate('jwt')
export class UserController {
  constructor(
    @repository(UserRepository) public userRepo: UserRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @get('/api/users/count', spec.responseCount())
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepo.count(where)
  }

  @get('/api/users', spec.responseList())
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepo.find(filter)
  }

  @patch('/api/users', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) user: User,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(User) where?: Where<User>
  ): Promise<Count> {
    user.editedAt = new Date().toLocaleString()
    user.editedBy = (await this.acountService.convertToUser(session)).id
    return this.userRepo.updateAll(user, where)
  }

  @get('/api/user/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(User, { exclude: 'where' })
    filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepo.findById(id, filter)
  }

  @patch('/api/user/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) user: User,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    user.editedAt = new Date().toLocaleString()
    user.editedBy = (await this.acountService.convertToUser(session)).id
    await this.userRepo.updateById(id, user)
  }
}
