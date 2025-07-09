// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DefaultCrudRepository } from '@loopback/repository'
import { AmaruMedPgcDataSource } from '../datasources'
import { Cros, CrosRelations } from '../models'
import { inject } from '@loopback/core'

export class CrosRepository extends DefaultCrudRepository<
  Cros,
  typeof Cros.prototype.id,
  CrosRelations
> {
  constructor(@inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource) {
    super(Cros, dataSource)
  }
}
