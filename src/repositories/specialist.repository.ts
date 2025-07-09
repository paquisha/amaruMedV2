// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DefaultCrudRepository } from '@loopback/repository'
import { Specialist, SpecialistRelations } from '../models'
import { AmaruMedPgcDataSource } from '../datasources'
import { inject } from '@loopback/core'

export class SpecialistRepository extends DefaultCrudRepository<
  Specialist,
  typeof Specialist.prototype.id,
  SpecialistRelations
> {
  constructor(@inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource) {
    super(Specialist, dataSource)
  }
}
