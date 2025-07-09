// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DefaultCrudRepository } from '@loopback/repository'
import { Module, ModuleRelations } from '../models'
import { AmaruMedPgcDataSource } from '../datasources'
import { inject } from '@loopback/core'

export class ModuleRepository extends DefaultCrudRepository<
  Module,
  typeof Module.prototype.id,
  ModuleRelations
> {
  constructor(@inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource) {
    super(Module, dataSource)
  }
}
