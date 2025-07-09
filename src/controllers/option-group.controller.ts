// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { authenticate } from '@loopback/authentication'
import { repository } from '@loopback/repository'
import { param, get } from '@loopback/rest'
import { Option, Group } from '../models'
import { OptionRepository } from '../repositories'
import spec from './specs/group.specs'

@authenticate('jwt')
export class OptionGroupController {
  constructor(
    @repository(OptionRepository)
    public optionRepository: OptionRepository
  ) {}

  @get('/api/option/{id}/group', spec.responseOne('Group belonging to Option'))
  async getGroup(
    @param.path.number('id') id: typeof Option.prototype.id
  ): Promise<Group> {
    return this.optionRepository.group(id)
  }
}
