// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { authenticate } from '@loopback/authentication'
import { repository } from '@loopback/repository'
import { param, get } from '@loopback/rest'
import { UserRepository } from '../repositories'
import { User, Role } from '../models'
import spec from './specs/role.specs'

@authenticate('jwt')
export class UserRoleController {
  constructor(@repository(UserRepository) public userRepository: UserRepository) {}

  @get('/api/user/{id}/role', spec.responseOneSimple('Role belonging to User'))
  async getRole(@param.path.number('id') id: typeof User.prototype.id): Promise<Role> {
    return this.userRepository.role(id)
  }
}
