// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { repository, Filter } from '@loopback/repository'
import { authenticate } from '@loopback/authentication'
import { get, param } from '@loopback/rest'
import { Module } from '../models'
import { ModuleRepository } from '../repositories'
import spect from './specs/module.specs'

@authenticate('jwt')
export class ModuleController {
  constructor(@repository(ModuleRepository) public moduleRepo: ModuleRepository) {}

  @get('/api/modules', spect.responseList())
  async find(@param.filter(Module) filter?: Filter<Module>): Promise<Module[]> {
    return this.moduleRepo.find(filter)
  }
}
